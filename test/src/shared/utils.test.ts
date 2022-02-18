import { chunk } from "@shared/utils"

describe("chunk", () => {
  it("chunks arrays correctly", () => {
    const array = [1, 2, 3, 4, 5, 6, 7, 8]

    expect(chunk({ elements: array, size: 3 })).toEqual([
      [1, 2, 3],
      [4, 5, 6],
      [7, 8]
    ])
  })
})
