export function getFileType(extname:string){
  const image = ['.jpg','.png','.jpeg']
  const video = ['.mp4']
  if(image.includes(extname)){
    return "image"
  }else if (video.includes(extname)){
    return "video"
  }
  return extname;
}