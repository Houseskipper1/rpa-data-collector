import { Injectable } from '@nestjs/common';
import * as fastCsv from 'fast-csv';
import { Observable } from 'rxjs';
import { EntrepriseEntity } from 'src/entreprise/entities/entreprise.entity';

@Injectable()
export class CsvfileGeneratorService {
   



    generateCsv(data: any[]): Observable<string> {
        return new Observable((observer) => {
          const csvStream = fastCsv.format({ headers: true });
          let csvData = '';
    
          csvStream
            .on('data', (chunk) => {
              csvData += chunk;
            })
            .on('end', () => {
              observer.next(csvData);
              observer.complete();
            });
    
          data.forEach((item) => {
            item.representatives = this.formatRepresentatives(item.representatives);
            csvStream.write(item);
          });
    
          csvStream.end();
        });
      }
    
      private formatRepresentatives(representatives: any[]): string {
        return representatives.map((rep) => `${rep.firstName} ${rep.lastName}`).join(', ');
      }
}
