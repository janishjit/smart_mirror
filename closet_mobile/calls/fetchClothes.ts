const S3_BUCKET_PREFIX = "http://magic-mirror-clothing-images.s3.amazonaws.com";
const API_URL = "http://107.22.249.15:8080";
// const API_URL = "http://localhost:8080";
const fetchUncategorizedClothes = async () => {
  let res = await fetch(`${API_URL}/uncategorized`);
  let json = await res.json();
  let links = json.map((key: string) => `${S3_BUCKET_PREFIX}/${key}`);
  return links;
};

const fetchShirts = async () => {
  let res = await fetch(`${API_URL}/shirts`);
  let json = await res.json();
  let links = json.map((key: string) => `${S3_BUCKET_PREFIX}/${key}`);

  return links;
};

const fetchPants = async () => {
  let res = await fetch(`${API_URL}/pants`);
  let json = await res.json();
  let links = json.map((key: string) => `${S3_BUCKET_PREFIX}/${key}`);

  return links;
};

export default fetchUncategorizedClothes;

export { fetchShirts, fetchPants };
