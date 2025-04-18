import {
  S3Client, PutObjectCommand, GetObjectCommand
} from "@aws-sdk/client-s3";
import {
  RekognitionClient,
  DetectFacesCommand,
  IndexFacesCommand,
  SearchFacesCommand,
  DeleteFacesCommand,
  Attribute,
  ListCollectionsCommand,
  CreateCollectionCommand,
  BoundingBox,
} from "@aws-sdk/client-rekognition";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
 
const bucketName = process.env.AWS_S3_BUCKET!;
const region = process.env.AWS_S3_REGION!;
const accessKeyId = process.env.AWS_S3_ACCESS_KEY!;
const secretAccessKey = process.env.AWS_S3_SECRET_KEY!;
const collectionId = "faces-collection";

const s3Client = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } });
const rekognitionClient = new RekognitionClient({ region, credentials: { accessKeyId, secretAccessKey } });
 

export async function ensureCollectionExists() {
  const res = await rekognitionClient.send(new ListCollectionsCommand({}));
  if (!res.CollectionIds?.includes(collectionId)) {
    await rekognitionClient.send(new CreateCollectionCommand({ CollectionId: collectionId }));
  }
}

async function uploadToS3(file: File): Promise<{ key: string; url: string }> {
  const buffer = await file.arrayBuffer();
  const key = `images/${Date.now()}-${file.name}`;
  await s3Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: Buffer.from(buffer),
      ContentType: file.type,
    })
  );
  const url = await getSignedUrl(
    s3Client,
    new GetObjectCommand({ Bucket: bucketName, Key: key }),
    { expiresIn: 50000 }
  );
  return { key, url };
}

function getSafeExternalImageId(key: string) {
  return key.replace("images/", "").replace(/[^a-zA-Z0-9_.\-:]/g, "_");
}

export interface IndexedFace {
  faceId: string;
  imageKey: string;
  boundingBox: BoundingBox;
  confidence: number;
}

async function detectAndIndexFaces(imageKey: string) {
  await rekognitionClient.send(
    new DetectFacesCommand({
      Image: { S3Object: { Bucket: bucketName, Name: imageKey } },
      Attributes: [Attribute.ALL],
    })
  );

  const indexRes = await rekognitionClient.send(
    new IndexFacesCommand({
      CollectionId: collectionId,
      Image: { S3Object: { Bucket: bucketName, Name: imageKey } },
      ExternalImageId: getSafeExternalImageId(imageKey),
    })
  );

  return indexRes.FaceRecords || [];
}

async function findBestMatch(faceId: string, allIndexedFaces: IndexedFace[]) {
  const search = await rekognitionClient.send(
    new SearchFacesCommand({
      CollectionId: collectionId,
      FaceId: faceId,
      MaxFaces: 5,
      FaceMatchThreshold: 95,
    })
  );

  return search.FaceMatches?.find(
    (match) => match.Face?.FaceId !== faceId && allIndexedFaces.some(f => f.faceId === match.Face?.FaceId)
  ) || null;
}

export async function processImage(file: File, allIndexedFaces: IndexedFace[]) {
  const { key, url } = await uploadToS3(file);
  const faceRecords = await detectAndIndexFaces(key);

  const faces = await Promise.all(faceRecords.map(async (record, index) => {
    const faceId = record.Face?.FaceId || "unknown-face-id";
    const boundingBox = record.Face?.BoundingBox || { Width: 0, Height: 0, Left: 0, Top: 0 };
    const confidence = record.Face?.Confidence ?? 0;

    const match = await findBestMatch(faceId, allIndexedFaces);

    if (boundingBox) {
      allIndexedFaces.push({ faceId, imageKey: key, boundingBox, confidence });
    }

    return {
      boundingBox,
      confidence,
      personId: match ? "Matched Person" : `Person ${index + 1}`,
      match: match
        ? { faceId: match.Face!.FaceId!, similarity: match.Similarity! }
        : null,
    };
  }));

  return { url, faces };
}

export async function deleteIndexedFaces(faces: IndexedFace[]) {
  if (faces.length > 0) {
    await rekognitionClient.send(
      new DeleteFacesCommand({
        CollectionId: collectionId,
        FaceIds: faces.map((f) => f.faceId),
      })
    );
  }
}
 
