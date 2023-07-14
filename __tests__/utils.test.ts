import { trimUntilNumber, startsWithNumbers } from "@/lib/utils";

describe("utils", () => {
  it("starts with number function should return true if string starts with number", () => {
    expect(startsWithNumbers("1231")).toBe(true);
    expect(startsWithNumbers("1010")).toBe(true);
    expect(startsWithNumbers("CS1010")).toBe(false);
    expect(startsWithNumbers("Programming Methodology")).toBe(false);
    expect(startsWithNumbers("CS")).toBe(false);
    expect(startsWithNumbers("")).toBe(false);
  });

  it("trim until number function should trim until number", () => {
    expect(trimUntilNumber("CS1010")).toBe("1010");
    expect(trimUntilNumber("CS1010S")).toBe("1010S");
    expect(trimUntilNumber("CG1111A")).toBe("1111A");
    expect(trimUntilNumber("1010")).toBe("1010");
    expect(trimUntilNumber("1010S")).toBe("1010S");
    expect(trimUntilNumber("1111A")).toBe("1111A");
    expect(trimUntilNumber("Programming Methodology")).toBe("");
    expect(trimUntilNumber("CS")).toBe("");
    expect(trimUntilNumber("")).toBe("");
  });
});
