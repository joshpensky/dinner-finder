module.exports = (bucket, file, filename) => {
  return new Promise((resolve, reject) => {
    const fileRef = bucket.file(filename);
    const stream = fileRef.createWriteStream({
      metadata: {
        contentType: file.mimetype
      },
      resumable: false,
    });
    stream.on('error', err => reject(err));
    stream.on('finish', () => {
      fileRef.makePublic().then(() => {
        resolve(`https://storage.googleapis.com/${bucket.name}/${filename}`);
      });
    });
    stream.end(file.buffer);
  });
}