function decodeBase64Image(image) {
  const content = atob(image.split(',')[1]);
  const imageFormat = image.split(';')[0].split(':')[1];
  return { content, imageFormat };
}

function encodeBase64Image(image) {
  const base64url = `data:${image.imageFormat};base64,${btoa(image.content)}`;
  return base64url.toString();
}

export {
  decodeBase64Image,
  encodeBase64Image,
};
