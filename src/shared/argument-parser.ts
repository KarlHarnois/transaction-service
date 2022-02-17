export class ArgumentParser {
  private readonly args

  constructor(args: string[]) {
    this.args = args
  }

  getArgument(name: string): string | undefined {
    let value: string | undefined = undefined

    this.args.forEach((arg, index) => {
      const valueIndex = index + 1

      if (arg == `--${name}` && this.args.length >= valueIndex + 1) {
        value = this.args[valueIndex]
      }
    })

    return value
  }
}
