import {
  directoryOpen,
  FileWithDirectoryAndFileHandle,
} from "browser-fs-access";

export type FileWrapper =
  | FileWithDirectoryAndFileHandle
  | FileSystemDirectoryHandle;

const validFileTypes = ["mp3", "mp4", "aac", "wave"];

export const getFilesFromDirectory = async (): Promise<
  FileWrapper[] | null
> => {
  const blobsInDirectory = await directoryOpen({
    recursive: true,
  });
  return blobsInDirectory.filter((x) =>
    validFileTypes.includes(x.name.split(".").pop()?.toLowerCase() ?? "")
  );
};

// export async function fileListToBase64(fileList) {
//     // create function which return resolved promise
//     // with data:base64 string
//     function getBase64(file) {
//       const reader = new FileReader()
//       return new Promise(resolve => {
//         reader.onload = ev => {
//           resolve(ev.target.result)
//         }
//         reader.readAsDataURL(file)
//       })
//     }
//     // here will be array of promisified functions
//     const promises = []

//     // loop through fileList with for loop
//     for (let i = 0; i < fileList.length; i++) {
//       promises.push(getBase64(fileList[i]))
//     }

//     // array with base64 strings
//     return await Promise.all(promises)
//   }
