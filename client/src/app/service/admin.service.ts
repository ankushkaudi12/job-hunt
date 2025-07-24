import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
    providedIn: 'root',
})

export class AdminService {
    constructor(private http: HttpClient) { }

    getAdminData(adminId: string, token: string): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${environment.apiUrl}/getAdminData/${adminId}`, { headers });
    }

    updateAdminData(adminId: string, data: any, token: string): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.put(`${environment.apiUrl}/updateAdmin/${adminId}`, data, { headers });
    }

    deleteAdmin(adminId: string, token: string): Observable<any> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.delete(`${environment.apiUrl}/deleteAdmin/${adminId}`, { headers });
    }
}