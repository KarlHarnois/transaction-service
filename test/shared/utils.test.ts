import { asyncFind, chunk } from "@shared/utils"

describe("asyncFind", () => {
  const elements = [1, 2, 3, 4]

  describe("when no element matches the predicate", () => {
    it("returns no elements", async () => {
      const result = await asyncFind(elements, async elem => elem > 5)
      expect(result).toEqual(undefined)
    })
  })

  describe("when some elemnents matches the predicate", () => {
    it("returns the first matching element", async () => {
      const result = await asyncFind(elements, async elem => elem > 1)
      expect(result).toEqual(2)
    })
  })
})

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
