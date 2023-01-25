// A function that binary searches to find the border two type of values
// Takes two parameters a and b which are block numbers in block chain

export function binarySearch(
  a: number,
  b: number,
  callback: (block: number) => Promise<boolean>
): Promise<number> {
  return new Promise((resolve, reject) => {
    const search = async (a: number, b: number) => {
      console.log("a: ", a, "b: ", b);
      if (a === b) {
        resolve(a);
        return;
      }
      const mid = Math.floor((a + b) / 2);
      const result = await callback(mid);
      if (result) {
        search(a, mid);
      } else {
        search(mid + 1, b);
      }
    };
    search(a, b);
  });
}

export async function binarySearchForProblemBlock(
  a: number,
  b: number,
  callback: (block: number) => Promise<boolean>
) {
  return await binarySearch(a, b, callback);
}
