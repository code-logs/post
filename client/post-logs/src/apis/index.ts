// import { getPostings } from './index';
// export const getPostings = async <T>(): T> => {
//   try {
//     const response = await fetch('/apis/posting')
//     return (await response.json()) as T
//   } catch (e) {
//     if (e instanceof Error) {
//       window.alert(e.message)
//     } else {
//       window.alert('Unexpected error occurred.')
//     }
//   }
// }

export const getPostings = async <T>() => {
  try {
    const response = await fetch('/apis/postings')
    const data = await response.json()
    return data as T
  } catch (e) {
    if (e instanceof Error) {
      alert(e.message)
    } else {
      alert('Unexpected error occurred')
    }

    throw e
  }
}
