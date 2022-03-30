const BACKEND_URL = "http://localhost:8080";
const S3_BUCKET_PREFIX = "http://magic-mirror-clothing-images.s3.amazonaws.com";
const fetchShirts = async () => {
  let res = await fetch(`${BACKEND_URL}/shirts`);
  if (res.ok) {
    let keys = await res.json();
    let urls = keys.map((key: string) => `${S3_BUCKET_PREFIX}/${key}`);
    return urls;
  } else {
    console.error("failed to get shirts");
    return [];
  }
};

const fetchPants = async () => {
  let res = await fetch(`${BACKEND_URL}/pants`);
  if (res.ok) {
    let keys = await res.json();
    let urls = keys.map((key: string) => `${S3_BUCKET_PREFIX}/${key}`);
    return urls;
  } else {
    console.error("failed to get pants");
    return [];
  }
};

const fetchClothing = async () => {
  let shirts = fetchShirts();
  let pants = fetchPants();

  return {
    pants: await pants,
    shirts: await shirts,
  };
};

export default fetchClothing;
