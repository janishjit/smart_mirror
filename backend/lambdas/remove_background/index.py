from rembg import remove
from PIL import Image
from io import BytesIO
import boto3

s3 = boto3.client('s3')

def lambda_handler(event, context):
  key = event["Records"][0]["s3"]["object"]["key"]
  bucket = event["Records"][0]["s3"]["bucket"]["name"]
  resp = s3.get_object(Bucket=bucket, Key=key)

  image_bytes = resp['Body'].read()
  
  input = Image.open(BytesIO(image_bytes))
  output = remove(input)
  output = output.rotate(-90)

  in_mem_file = BytesIO()
  output.save(in_mem_file, format="PNG")
  in_mem_file.seek(0)

  png_key = key.replace(".jpg", ".png")

  s3.put_object(Bucket="magic-mirror-clothing-images", Key=png_key, Body=in_mem_file)

  print("Successfully saved object with removed background to S3")
  
  return {
    'statusCode': 200,
  }