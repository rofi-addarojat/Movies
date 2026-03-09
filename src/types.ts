export interface MovieItem {
  id: string | number;
  title: string;
  poster: string;
  rating: string | number;
  year: string | number;
  type: string;
  genre: string;
  detailPath: string;
}

export interface ApiResponse {
  success: boolean;
  items: MovieItem[];
  page?: number;
  hasMore?: boolean;
}

export interface Episode {
  episode: number;
  title: string;
  cover?: string;
  playerUrl?: string;
}

export interface Season {
  season: number;
  episodes: Episode[];
}

export interface MovieDetail extends MovieItem {
  description: string;
  playerUrl: string;
  seasons?: Season[];
}

export interface DetailApiResponse {
  success: boolean;
  detail: MovieDetail;
}
