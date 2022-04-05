const S3_BUCKET_PREFIX = "http://magic-mirror-clothing-images.s3.amazonaws.com";

const fetchUncategorizedClothes = async () => {
  let res = await fetch("http://localhost:8080/uncategorized");
  let json = await res.json();
  let links = json.map((key: string) => `${S3_BUCKET_PREFIX}/${key}`);
  return links;
};

const fetchShirts = async () => {
  let res = await fetch("http://localhost:8080/shirts");
  let json = await res.json();
  let links = json.map((key: string) => `${S3_BUCKET_PREFIX}/${key}`);

  return links;
};

const fetchPants = async () => {
  let res = await fetch("http://localhost:8080/pants");
  let json = await res.json();
  let links = json.map((key: string) => `${S3_BUCKET_PREFIX}/${key}`);

  return links;
};

export default fetchUncategorizedClothes;

export { fetchShirts, fetchPants };
