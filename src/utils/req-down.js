// 这个文件专门用于文件下载，结合后台blob格式的文件下载。
import axios from 'axios'
export function downloadFile(config) {
  return new Promise((resolve, reject) => {
    axios({
      url: config.url,// 请求地址
      method: 'get',
      // data: config.data,// 参数
      responseType: 'blob'// 表明返回服务器返回的数据类型
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(err);
    });
  });
}