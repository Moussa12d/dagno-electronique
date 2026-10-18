const IMGBB_API_KEY = process.env.IMGBB_API_KEY;

if (!IMGBB_API_KEY) {
  console.warn("[ImgBB] Attention : IMGBB_API_KEY n'est pas défini");
}

export const imgbbApiKey = IMGBB_API_KEY;
export const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";