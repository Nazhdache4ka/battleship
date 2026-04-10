import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE3MTYyMzkwMjIsImV4cCI6MTcyNjIzOTAyMn0.g25XN6aTtA3u48WYRwV8r5aJmQk_lG795xQ1Kc0r9U',
  })
  accessToken: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhZG1pbkBhZG1pbi5jb20iLCJpYXQiOjE3MTYyMzkwMjIsImV4cCI6MTcyNjIzOTAyMn0.g25XN6aTtA3u48WYRwV8r5aJmQk_lG795xQ1Kc0r9U',
  })
  refreshToken: string;
}
