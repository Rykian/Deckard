/**
 * Domain Entity: Track
 * Represents a music track in the domain model
 */
export class TrackEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly artists: string[],
    public readonly album: string,
    public readonly releaseDate: string,
    public readonly coverUrl: string,
    public readonly externalUrl: string,
    public readonly durationMs: number,
  ) {}

  static create(params: {
    id: string
    name: string
    artists: string[]
    album: string
    releaseDate: string
    coverUrl: string
    externalUrl: string
    durationMs: number
  }): TrackEntity {
    return new TrackEntity(
      params.id,
      params.name,
      params.artists,
      params.album,
      params.releaseDate,
      params.coverUrl,
      params.externalUrl,
      params.durationMs,
    )
  }
}
