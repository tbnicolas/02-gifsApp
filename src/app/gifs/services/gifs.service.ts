import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchGifsResponse } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  // tslint:disable-next-line: variable-name
  private _historial: string[] = [];

  private apiKey      : string = 'UMKyg5WF2NnLrfPFOQU8Jg5BEbqqsaGm';
  private servicioUrl : string = 'https://api.giphy.com/v1/gifs';


  public resultados: Gif[] = [];

  get historial(): string [] {
    return [...this._historial];
  }
  constructor(private http: HttpClient) {
    if ( localStorage.getItem('historial') ) {
      this._historial = JSON.parse(localStorage.getItem('historial')!);
    }

    if ( localStorage.getItem('resultados') ) {
      this.resultados = JSON.parse(localStorage.getItem('resultados')!);
    }
  }

  buscarGifs( query: string ): void {

    query = query.trim().toLowerCase();

    if ( !this.historial.includes( query ) ) {
      this._historial.unshift( query );
      this._historial = this._historial.splice(0, 10);
      localStorage.setItem('historial',JSON.stringify(this._historial));
    }

    const params = new HttpParams()
    .set('api_key',this.apiKey)
    .set('limit','10')
    .set('q',query);

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`,{ params })
        .subscribe(
          (resp) =>{
            console.log(resp.data);
            this.resultados = resp.data;
            localStorage.setItem('resultados',JSON.stringify(this.resultados));
          }
        );
  }

}
