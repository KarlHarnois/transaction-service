export async function asyncFind<A>(
  array: A[],
  predicate: (a: A) => Promise<boolean>
) {
  const result = await Promise.all(array.map(predicate))
  return array.find((_, index) => result[index])
}

export function env(key: string): string {
  const value = process.env[key]

  if (value) {
    return value
  } else {
    throw new Error(`Environment variable $${key} is not defined`)
  }
}

export function chunk<A>(args: { elements: A[]; size: number }): A[][] {
  let resultArray: A[][] = []

  args.elements.forEach((elem, index) => {
    const chunkIndex = Math.floor(index / args.size)
    if (!resultArray[chunkIndex]) resultArray[chunkIndex] = []
    resultArray[chunkIndex].push(elem)
  })
  return resultArray
}

export interface LoggableEvent {
  category: "ERROR" | "LAMBDA_EVENT" | "QUERY" | "TRANSACT_WRITE" | "WARN"
  payload: any
}

export class Logger {
  logEvent(event: LoggableEvent) {
    const fullPayload = {
      category: event.category,
      ...event.payload
    }
    console.log(`${event.category}\n`, JSON.stringify(fullPayload))
  }
}
