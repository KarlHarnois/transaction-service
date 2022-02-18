export type Option = "sourceName"

export class ArgumentParser {
  private readonly args

  constructor(args: string[]) {
    this.args = args
  }

  getArgument(option: Option): string | undefined {
    let value: string | undefined = undefined

    this.args.forEach((arg, index) => {
      const valueIndex = index + 1

      if (arg == `--${option}` && this.args.length >= valueIndex + 1) {
        value = this.args[valueIndex]
      }
    })

    return value
  }
}
