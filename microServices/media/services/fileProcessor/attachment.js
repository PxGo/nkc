const ei = require("easyimage");
const PATH = require('path');
const {getFileInfo, deleteFile} = require('../../tools');
const storeClient = require('../../../../tools/storeClient');
module.exports = async (props) => {
  const {
    file,
    data,
    storeUrl
  } = props;
  const {
    timePath,
    mediaPath,
    toc,
    images = []
  } = data;
  const time = (new Date(toc)).getTime();
  const filePath = file.path;
  const storeFiles = [];
  const filesInfo = {};
  for(const image of images) {
    const {
      type,
      filename,
      height,
      width,
      quality,
      background = 'transparent'
    } = image;
    const path = PATH.join(mediaPath, timePath, filename);
    const targetFilePath = filePath + '.temp.' + filename;
    await ei.resize({
      src: filePath,
      dst: targetFilePath,
      height,
      width,
      quality,
      background
    });
    storeFiles.push({
      filePath: targetFilePath,
      path,
      time
    });
    const {size, hash, ext} = await getFileInfo(targetFilePath);
    filesInfo[type] = {
      ext,
      size,
      hash,
      filename,
      height,
      width,
    };
  }
  await storeClient(storeUrl, storeFiles);
  for(const s of storeFiles) {
    await deleteFile(s.filePath);
  }
  return filesInfo;
}