import ajv from "ajv"
import Ajv from "ajv"
import * as schema from "./schema.json"

export class SchemaValidatorArguments {
  definition: string
  data: any
}

export class SchemaValidator {
  private readonly ajv

  constructor() {
    this.ajv = new Ajv({ allErrors: true, schemas: [schema] })
  }

  validate(args: SchemaValidatorArguments) {
    const validate = this.ajv.getSchema(`#/definitions/${args.definition}`)

    if (validate === undefined) {
      throw new Error(
        `Schema definition for type ${args.definition} not found.`
      )
    }
    if (validate(args.data)) return
    throw this.mergeErrors(validate.errors ?? [])
  }

  private mergeErrors(errors: ajv.ErrorObject[]) {
    const messages = errors.map((error) => error.message).join(", ")
    return new Error(`JSON schema validation error: ${messages}.`)
  }
}
