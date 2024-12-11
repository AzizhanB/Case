import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface Location {
  lat: number;
  lng: number;
  name: string;
  celcius: string;
  damp: string;
  battery: 'low' | 'medium' | 'high';
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe]
})
export class AppComponent implements AfterViewInit {
  private map!: L.Map;
  private markers: Map<string, any> = new Map();
  private currentActiveWidget: string | null = null;
  currentDate = new Date();
  searchText: string = '';
  filteredLocations: Location[] = [];

  constructor(
    private datePipe: DatePipe,
    private sanitizer: DomSanitizer
  ) {
    this.filteredLocations = this.locations;
  }

  

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initMap();
      this.addWidgetClickEvents();
    }, 100);
  }

  public locations: Location[] = [
    { lat: 47.751076, lng: -120.740135, name: "Washington", celcius: "27", damp: "58", battery: "high" },
    { lat: 44.500000, lng: -89.500000, name: "Wisconsin", celcius: "28", damp: "30", battery: "medium" },
    { lat: 39.000000, lng: -80.500000, name: "West Virginia", celcius: "16", damp: "33", battery: "low" },
    { lat: 34.969704, lng: -92.373123, name: "Arkansas", celcius: "30", damp: "21", battery: "high" },
    { lat: 33.729759, lng: -111.431221, name: "Arizona", celcius: "18", damp: "30", battery: "medium" },
    { lat: 36.116203, lng: -119.681564, name: "California", celcius: "25", damp: "51", battery: "high" },
    { lat: 30.266667, lng: -97.733333, name: "Texas", celcius: "26", damp: "50", battery: "low" },
    { lat: 27.994402, lng: -81.760254, name: "Florida", celcius: "23", damp: "29", battery: "medium" }
  ];

  getBatteryIcon(status: 'low' | 'medium' | 'high'): SafeHtml {
    let svgContent = '';
    switch (status) {
      case 'low':
        svgContent = `<div style="display: inline-flex; align-items: center;">
          <svg width="29" height="14" viewBox="0 0 29 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.5405 4.50276V3.23587C27.5405 1.45375 26.1745 0 24.4907 0H3.04982C1.36605 0 0 1.45372 0 3.23587V10.7641C0 12.5462 1.36601 14 3.04982 14H24.4893C26.173 14 27.5391 12.5463 27.5391 10.7641V9.40383C28.392 9.04915 29 8.16758 29 7.14004V6.7664C29 5.73886 28.3906 4.85728 27.5391 4.50261L27.5405 4.50276ZM25.7797 10.7659C25.7797 11.5204 25.2019 12.1335 24.4907 12.1335L3.04982 12.132C2.33862 12.132 1.76082 11.519 1.76082 10.7644V3.23613C1.76082 2.48154 2.33859 1.8685 3.04982 1.8685H24.4893C25.2005 1.8685 25.7783 2.48151 25.7783 3.23613V10.7644L25.7797 10.7659Z" fill="#AF3436"/>
            <path d="M7.85812 3.5H4.14163C4.06375 3.5 4 3.78045 4 4.1324V9.8648C4 10.2168 4.06344 10.5 4.14163 10.5H7.85837C7.93625 10.5 8 10.2168 8 9.8648V4.1324C8 3.78044 7.93632 3.5 7.85812 3.5Z" fill="#AF3436"/>
          </svg>
        </div>`;
        break;
      case 'medium':
        svgContent = `<div style="display: inline-flex; align-items: center;">
          <svg width="29" height="14" viewBox="0 0 29 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.5405 4.50276V3.23587C27.5405 1.45375 26.1745 0 24.4907 0H3.04982C1.36605 0 0 1.45372 0 3.23587V10.7641C0 12.5462 1.36601 14 3.04982 14H24.4893C26.173 14 27.5391 12.5463 27.5391 10.7641V9.40383C28.392 9.04915 29 8.16758 29 7.14004V6.7664C29 5.73886 28.3906 4.85728 27.5391 4.50261L27.5405 4.50276ZM25.7797 10.7659C25.7797 11.5204 25.2019 12.1335 24.4907 12.1335L3.04982 12.132C2.33862 12.132 1.76082 11.519 1.76082 10.7644V3.23613C1.76082 2.48154 2.33859 1.8685 3.04982 1.8685H24.4893C25.2005 1.8685 25.7783 2.48151 25.7783 3.23613V10.7644L25.7797 10.7659Z" fill="#D1961F"/>
            <path d="M15.5744 3.5H4.4249C4.19125 3.5 4 3.78045 4 4.1324V9.8648C4 10.2168 4.19031 10.5 4.4249 10.5H15.5751C15.8087 10.5 16 10.2168 16 9.8648V4.1324C16 3.78044 15.809 3.5 15.5744 3.5Z" fill="#D1961F"/>
          </svg>
        </div>`;
        break;
      case 'high':
        svgContent = `<div style="display: inline-flex; align-items: center;">
          <svg width="29" height="14" viewBox="0 0 29 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M27.5405 4.50276V3.23587C27.5405 1.45375 26.1745 0 24.4907 0H3.04982C1.36605 0 0 1.45372 0 3.23587V10.7641C0 12.5462 1.36601 14 3.04982 14H24.4893C26.173 14 27.5391 12.5463 27.5391 10.7641V9.40383C28.392 9.04915 29 8.16758 29 7.14004V6.7664C29 5.73886 28.3906 4.85728 27.5391 4.50261L27.5405 4.50276ZM25.7797 10.7659C25.7797 11.5204 25.2019 12.1335 24.4907 12.1335L3.04982 12.132C2.33862 12.132 1.76082 11.519 1.76082 10.7644V3.23613C1.76082 2.48154 2.33859 1.8685 3.04982 1.8685H24.4893C25.2005 1.8685 25.7783 2.48151 25.7783 3.23613V10.7644L25.7797 10.7659Z" fill="#34AF6F"/>
            <path d="M23.2294 3.5H4.70592C4.31774 3.5 4 3.78045 4 4.1324V9.8648C4 10.2168 4.31618 10.5 4.70592 10.5H23.2306C23.6188 10.5 23.9365 10.2168 23.9365 9.8648V4.1324C23.9365 3.78044 23.6191 3.5 23.2294 3.5Z" fill="#34AF6F"/>
          </svg>
        </div>`;
        break;
      default:
        return this.sanitizer.bypassSecurityTrustHtml('');
    }
    return this.sanitizer.bypassSecurityTrustHtml(svgContent);
  }

  private createPopupContent(loc: Location): string {
    return `
      <div class="bg-white p-4 rounded-lg min-w-[300px]">
        <h3 class="text-xl font-semibold mb-4">Nem ve Sıcaklık Sensörü</h3>
        <p class="text-gray-600 mb-4">${loc.name}</p>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <svg width="24" height="31" viewBox="0 0 24 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.1791 17.7152V3.34904C14.025 -1.10831 7.59574 -1.12437 7.43618 3.34904V17.7152C1.35314 21.204 3.78643 30.4895 10.805 30.5523C12.8399 30.5496 14.7686 29.6453 16.071 28.0809C17.3735 26.5179 17.915 24.457 17.5495 22.4563C17.1839 20.4541 15.9496 18.7179 14.1793 17.7155L14.1791 17.7152ZM10.8048 28.4067C8.62258 28.3999 6.72805 26.8969 6.22771 24.772C5.72579 22.6484 6.74736 20.4568 8.69772 19.4746C9.24192 19.2032 9.58563 18.6453 9.58291 18.037V3.34932C9.58154 3.02471 9.71112 2.71103 9.94024 2.48187C10.1707 2.25137 10.4831 2.12182 10.8077 2.12182C11.1337 2.12182 11.446 2.25139 11.6765 2.48187C11.9056 2.71101 12.0352 3.02471 12.0338 3.34932V18.037C12.0311 18.644 12.3721 19.2004 12.9135 19.4746C14.8667 20.4539 15.8909 22.647 15.389 24.7734C14.8871 26.8997 12.9898 28.4039 10.8048 28.4067Z" fill="#007DFC"/>
              <path d="M10.805 20.4731C9.03465 20.4786 7.60254 21.9161 7.60254 23.6865C7.7553 27.942 13.8629 27.935 14.0127 23.6865C14.0127 21.9134 12.578 20.4759 10.805 20.4731Z" fill="#007DFC"/>
              <!-- Rest of the SVG paths remain the same -->
            </svg>
            <span class="text-2xl">${loc.celcius} °C</span>
          </div>
          <button class="bg-[#F2F9FF] text-blue-500 px-4 py-2 rounded-lg shadow-sm border border-gray-200 w-32 temperature-button" data-lat="${loc.lat}" data-lng="${loc.lng}" data-temp="${loc.celcius}">
            <span class="font-bold">Sıcaklık</span> Ayarla
          </button>
        </div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.1243 17.3757C17.298 17.3757 17.4515 17.3555 17.5883 17.323C17.5401 18.4 17.298 19.4579 16.8901 20.4342C16.6323 20.3893 16.4743 20.2649 16.277 20.0991C15.9901 19.8648 15.6315 19.5746 14.9613 19.5746C14.2878 19.5746 13.9325 19.8648 13.6456 20.0991C13.3879 20.3086 13.2063 20.4577 12.7939 20.4577C12.3859 20.4577 12.201 20.3086 11.9466 20.0991C11.6597 19.8648 11.3056 19.5746 10.6309 19.5746C10.4292 19.5746 10.2633 19.7404 10.2633 19.9455C10.2633 20.1473 10.4292 20.3131 10.6309 20.3131C11.0389 20.3131 11.2238 20.4622 11.4782 20.6717C11.7651 20.906 12.1192 21.1962 12.7939 21.1962C13.4674 21.1962 13.8227 20.906 14.1096 20.6717C14.3673 20.4622 14.5489 20.3131 14.9613 20.3131C15.3693 20.3131 15.5542 20.4622 15.8086 20.6717C16.0058 20.8331 16.2367 21.0192 16.5752 21.1156C15.3805 23.4444 13.1975 25.2352 10.3609 25.6959C9.85766 25.7811 9.341 25.8215 8.81204 25.8215C8.28308 25.8215 7.76307 25.7811 7.25425 25.6959C1.36701 24.74 -1.70371 18.0853 0.979402 12.7595L6.77799 1.251C7.61741 -0.419981 10.0022 -0.415505 10.8417 1.25548L16.5751 12.6834Z" fill="#007DFC"/>
              <!-- Rest of the SVG paths remain the same -->
            </svg>
            <span class="text-2xl">% ${loc.damp}</span>
          </div>
          <button class="bg-[#F2F9FF] text-blue-500 px-4 py-2 rounded-lg shadow-sm border border-gray-200 w-32 humidity-button" data-lat="${loc.lat}" data-lng="${loc.lng}" data-humidity="${loc.damp}">
          <span class="font-bold">Nem</span> Ayarla
          </button>
        </div>
      </div>
    `;
  }

  private setActiveWidget(widgetId: string) {
    document.querySelectorAll('.weather-card').forEach(card => {
      card.classList.remove('active-marker-widget');
    });
  
    const activeWidget = document.getElementById(widgetId);
    if (activeWidget) {
      activeWidget.classList.add('active-marker-widget');
    }
  }

  private addWidgetClickEvents(): void {
    document.querySelectorAll('.weather-card').forEach((card) => {
      card.addEventListener('click', () => {
        const widgetId = card.getAttribute('id');
        if (widgetId) {
          const locationName = widgetId.replace('widget-', '');
          const marker = this.markers.get(locationName);
  
          if (marker) {
            if (this.currentActiveWidget === widgetId) {
              this.map.closePopup();
              this.currentActiveWidget = null;
              this.setActiveWidget('');
            } else {
              marker.openPopup();
              this.setActiveWidget(widgetId);
              this.currentActiveWidget = widgetId;
            }
          }
        } else {
          console.warn('Widget ID bulunamadı!');
        }
      });
    });
  }

  private resetMarkers() {
    this.markers.forEach(({ element }) => {
      if (element) {
        element.classList.remove('active-marker');
        element.style.setProperty('z-index', '40', 'important');
      }
    });
  }

  filterLocations() {
    if (!this.searchText) {
      this.filteredLocations = this.locations;
    } else {
      const searchLower = this.searchText.toLowerCase();
      this.filteredLocations = this.locations.filter(location => 
        location.name.toLowerCase().includes(searchLower)
      );
    }

    this.locations.forEach(location => {
      const marker = this.markers.get(location.name.toLowerCase());
      if (marker) {
        const isVisible = this.filteredLocations.some(
          loc => loc.name.toLowerCase() === location.name.toLowerCase()
        );
        if (isVisible) {
          marker.addTo(this.map);
        } else {
          marker.remove();
        }
      }
    });
  }

  private setActiveMarker(markerElement: HTMLElement | null) {
    this.resetMarkers();
  
    if (markerElement) {
      markerElement.classList.add('active-marker');
      markerElement.style.setProperty('z-index', '700', 'important');
    }
  }

  formatDate(date: Date): string {
    const now = new Date();
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const randomTimestamp = yesterday.getTime() + Math.random() * (now.getTime() - yesterday.getTime());
    const randomDate = new Date(randomTimestamp);
    
    return this.datePipe.transform(randomDate, 'dd/MM/yyyy HH:mm') || '';
  }

  private openTemperaturePopup(lat: number, lng: number, currentTemp: string): void {
    const temperaturePopupContent = `
      <div class="bg-white p-6 rounded-lg min-w-[300px]">
      <h3 class="text-blue-500 text-lg mb-1"> <span class="font-bold text-blue-600">Sıcaklık</span> Ayarla</h3>
      <p class="text-gray-500 text-sm mb-4">Salon</p>
      
      <div class="flex justify-between items-start mb-6">
        <div class="flex flex-col items-center">
          <span class="text-gray-500 text-sm mb-2">Mevcut</span>
          <div class="flex items-center space-x-2">
            <svg width="24" height="31" viewBox="0 0 24 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.1791 17.7152V3.34904C14.025 -1.10831 7.59574 -1.12437 7.43618 3.34904V17.7152C1.35314 21.204 3.78643 30.4895 10.805 30.5523C12.8399 30.5496 14.7686 29.6453 16.071 28.0809C17.3735 26.5179 17.915 24.457 17.5495 22.4563C17.1839 20.4541 15.9496 18.7179 14.1793 17.7155L14.1791 17.7152ZM10.8048 28.4067C8.62258 28.3999 6.72805 26.8969 6.22771 24.772C5.72579 22.6484 6.74736 20.4568 8.69772 19.4746C9.24192 19.2032 9.58563 18.6453 9.58291 18.037V3.34932C9.58154 3.02471 9.71112 2.71103 9.94024 2.48187C10.1707 2.25137 10.4831 2.12182 10.8077 2.12182C11.1337 2.12182 11.446 2.25139 11.6765 2.48187C11.9056 2.71101 12.0352 3.02471 12.0338 3.34932V18.037C12.0311 18.644 12.3721 19.2004 12.9135 19.4746C14.8667 20.4539 15.8909 22.647 15.389 24.7734C14.8871 26.8997 12.9898 28.4039 10.8048 28.4067Z" fill="#007DFC"/>
              <path d="M10.805 20.4731C9.03465 20.4786 7.60254 21.9161 7.60254 23.6865C7.7553 27.942 13.8629 27.935 14.0127 23.6865C14.0127 21.9134 12.578 20.4759 10.805 20.4731Z" fill="#007DFC"/>
            </svg>
            <span class="text-xl text-gray-800">${currentTemp} °C</span>
          </div>
        </div>
        
        <div class="flex flex-col items-center">
          <span class="text-gray-500 text-sm mb-2">Yeni</span>
          <div class="flex items-center space-x-2">
            <input type="number" id="new-temperature" class="w-20 h-10 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value="${currentTemp}" />
            <span class="text-xl text-gray-800">°C</span>
          </div>
        </div>
      </div>
      
      <div class="flex space-x-3">
        <button class="flex-1 h-10 bg-white text-gray-700 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 cancel-temp">İptal et</button>
        <button class="flex-1 h-10 bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600 update-temp">Güncelle</button>
      </div>
      </div>
    `;

    const popup = L.popup({
      className: 'custom-temperature-popup',
      maxWidth: 300,
      closeButton: false,
      offset: [-50, 220]
    })
      .setLatLng([lat, lng])
      .setContent(temperaturePopupContent)
      .openOn(this.map);

    setTimeout(() => {
      const cancelButton = document.querySelector('.cancel-temp');
      const updateButton = document.querySelector('.update-temp');
      const tempInput = document.getElementById('new-temperature') as HTMLInputElement;

      if (cancelButton) {
        cancelButton.addEventListener('click', () => {
          popup.remove();
          this.resetMapPopup(lat, lng);
        });
      }

      if (updateButton && tempInput) {
        updateButton.addEventListener('click', () => {
          const newTemp = tempInput.value;
          this.updateTemperature(lat, lng, newTemp);
          popup.remove();
          this.resetMapPopup(lat, lng);
        });
      }
    }, 100);
  }



  private updateTemperature(lat: number, lng: number, newTemp: string): void {
    const location = this.locations.find(loc => loc.lat === lat && loc.lng === lng);
    if (location) {
      location.celcius = newTemp;
      
      const marker = this.markers.get(location.name.toLowerCase());
      if (marker) {
        const newPopupContent = this.createPopupContent(location);
        marker.unbindPopup();
        const popup = L.popup({
          className: 'custom-popup',
          maxWidth: 300,
          closeButton: false,
          offset: [-50, 220]
        }).setContent(newPopupContent);
        
        marker.bindPopup(popup);
      }
  
      this.filteredLocations = [...this.locations];
    }
  }

  

  private openHumidityPopup(lat: number, lng: number, currentHumidity: string): void {
    const humidityPopupContent = `
      <div class="bg-white p-6 rounded-lg min-w-[300px]">
        <h3 class="text-blue-500 text-lg mb-1"> <span class="font-bold text-blue-600">Nem</span> Ayarla</h3>
        <p class="text-gray-500 text-sm mb-4">Salon</p>
        
        <div class="flex justify-between items-start mb-6">
          <div class="flex flex-col items-center">
            <span class="text-gray-500 text-sm mb-2">Mevcut</span>
            <div class="flex items-center space-x-2">
              <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.1243 17.3757C17.298 17.3757 17.4515 17.3555 17.5883 17.323C17.5401 18.4 17.298 19.4579 16.8901 20.4342C16.6323 20.3893 16.4743 20.2649 16.277 20.0991C15.9901 19.8648 15.6315 19.5746 14.9613 19.5746C14.2878 19.5746 13.9325 19.8648 13.6456 20.0991C13.3879 20.3086 13.2063 20.4577 12.7939 20.4577C12.3859 20.4577 12.201 20.3086 11.9466 20.0991C11.6597 19.8648 11.3056 19.5746 10.6309 19.5746C10.4292 19.5746 10.2633 19.7404 10.2633 19.9455C10.2633 20.1473 10.4292 20.3131 10.6309 20.3131C11.0389 20.3131 11.2238 20.4622 11.4782 20.6717C11.7651 20.906 12.1192 21.1962 12.7939 21.1962C13.4674 21.1962 13.8227 20.906 14.1096 20.6717C14.3673 20.4622 14.5489 20.3131 14.9613 20.3131C15.3693 20.3131 15.5542 20.4622 15.8086 20.6717C16.0058 20.8331 16.2367 21.0192 16.5752 21.1156C15.3805 23.4444 13.1975 25.2352 10.3609 25.6959C9.85766 25.7811 9.341 25.8215 8.81204 25.8215C8.28308 25.8215 7.76307 25.7811 7.25425 25.6959C1.36701 24.74 -1.70371 18.0853 0.979402 12.7595L6.77799 1.251C7.61741 -0.419981 10.0022 -0.415505 10.8417 1.25548L16.5751 12.6834C16.4743 12.6229 16.3813 12.5467 16.277 12.4615C15.9901 12.2272 15.6315 11.937 14.9613 11.937C14.2877 11.937 13.9325 12.2273 13.6456 12.4615C13.3878 12.6677 13.2063 12.8201 12.7938 12.8201C12.3859 12.8201 12.201 12.6666 11.9466 12.4615C11.6597 12.2272 11.3055 11.937 10.6309 11.937C10.4292 11.937 10.2633 12.0984 10.2633 12.3046C10.2633 12.5063 10.4292 12.6722 10.6309 12.6722C11.0388 12.6722 11.2237 12.8257 11.4781 13.0308C11.765 13.265 12.1192 13.5553 12.7938 13.5553C13.4674 13.5553 13.8226 13.265 14.1096 13.0308C14.3673 12.8246 14.5489 12.6722 14.9613 12.6722C15.3693 12.6722 15.5542 12.8257 15.8086 13.0308C16.0708 13.2448 16.3981 13.5071 16.9663 13.5474C17.354 14.5325 17.5558 15.5412 17.5916 16.5453C17.4661 16.6013 17.3215 16.6383 17.1232 16.6383C16.7152 16.6383 16.5303 16.4892 16.2759 16.2797C15.989 16.0499 15.6304 15.7552 14.9602 15.7552C14.2867 15.7552 13.9314 16.0499 13.6445 16.2797C13.3867 16.4892 13.2052 16.6383 12.7928 16.6383C12.3848 16.6383 12.1999 16.4892 11.9455 16.2797C11.6586 16.0499 11.3044 15.7552 10.6298 15.7552C10.4281 15.7552 10.2622 15.921 10.2622 16.1261C10.2622 16.3279 10.4281 16.4937 10.6298 16.4937C11.0377 16.4937 11.2227 16.6473 11.477 16.8524C11.764 17.0866 12.1181 17.3768 12.7928 17.3768C13.4663 17.3768 13.8216 17.0866 14.1085 16.8524C14.3662 16.6461 14.5478 16.4937 14.9602 16.4937C15.3682 16.4937 15.5531 16.6473 15.8075 16.8524C16.0955 17.0855 16.4552 17.3757 17.1243 17.3757ZM23.6335 11.9357C22.96 11.9357 22.6002 12.226 22.3144 12.4602C22.06 12.6664 21.8751 12.8188 21.4627 12.8188C21.0514 12.8188 20.8654 12.6653 20.6109 12.4602C20.324 12.226 19.9654 11.9357 19.2918 11.9357C18.6217 11.9357 18.263 12.226 17.9761 12.4602C17.7217 12.6664 17.5368 12.8188 17.1244 12.8188C16.8823 12.8188 16.7209 12.7661 16.5752 12.6821L16.6279 12.783C16.7534 13.0329 16.8655 13.2917 16.9664 13.5462C17.019 13.554 17.0717 13.554 17.1233 13.554C17.7968 13.554 18.1566 13.2638 18.4423 13.0295C18.6967 12.8233 18.8817 12.6709 19.2896 12.6709C19.7009 12.6709 19.8869 12.8244 20.1447 13.0295C20.4316 13.2638 20.7858 13.554 21.4604 13.554C22.134 13.554 22.4892 13.2638 22.7795 13.0295C23.0339 12.8233 23.2188 12.6709 23.6313 12.6709C23.833 12.6709 23.9988 12.505 23.9988 12.3033C24.0011 12.0971 23.8353 11.9357 23.6335 11.9357ZM23.6335 15.7541C22.96 15.7541 22.6002 16.0488 22.3144 16.2786C22.06 16.4881 21.8751 16.6372 21.4627 16.6372C21.0514 16.6372 20.8654 16.4881 20.6109 16.2786C20.324 16.0488 19.9654 15.7541 19.2918 15.7541C18.6217 15.7541 18.263 16.0488 17.9761 16.2786C17.8428 16.3873 17.7296 16.4803 17.5929 16.5453C17.6052 16.8076 17.6007 17.0653 17.5884 17.3242C17.9795 17.2312 18.2294 17.0261 18.4435 16.8524C18.6979 16.6462 18.8828 16.4937 19.2907 16.4937C19.702 16.4937 19.8881 16.6473 20.1459 16.8524C20.4328 17.0866 20.7869 17.3769 21.4616 17.3769C22.1351 17.3769 22.4904 17.0866 22.7807 16.8524C23.0351 16.6462 23.22 16.4937 23.6324 16.4937C23.8341 16.4937 24 16.3279 24 16.1262C24.0011 15.9188 23.8353 15.7541 23.6335 15.7541ZM23.6335 19.5745C22.96 19.5745 22.6002 19.8647 22.3144 20.099C22.06 20.3085 21.8751 20.4576 21.4627 20.4576C21.0514 20.4576 20.8654 20.3085 20.6109 20.099C20.324 19.8647 19.9654 19.5745 19.2918 19.5745C18.6183 19.5745 18.263 19.8647 17.9761 20.099C17.7217 20.3085 17.5368 20.4576 17.1244 20.4576C17.0358 20.4576 16.9585 20.4498 16.8902 20.4329C16.7971 20.6672 16.6929 20.8924 16.5752 21.1143C16.7321 21.167 16.9137 21.195 17.1244 21.195C17.7979 21.195 18.1577 20.9048 18.4435 20.6705C18.6979 20.461 18.8828 20.3119 19.2907 20.3119C19.702 20.3119 19.8881 20.461 20.1425 20.6705C20.4327 20.9048 20.788 21.195 21.4616 21.195C22.1351 21.195 22.4904 20.9048 22.7807 20.6705C23.0351 20.461 23.22 20.3119 23.6324 20.3119C23.8341 20.3119 24 20.146 24 19.9443C24.0011 19.7404 23.8353 19.5745 23.6335 19.5745Z" fill="#007DFC"/>
              </svg>
              <span class="text-xl text-gray-800">% ${currentHumidity}</span>
            </div>
          </div>
          
          <div class="flex flex-col items-center">
            <span class="text-gray-500 text-sm mb-2">Yeni</span>
            <div class="flex items-center space-x-2">
              <input type="number" id="new-humidity" class="w-20 h-10 text-center text-xl border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value="${currentHumidity}" />
              <span class="text-xl text-gray-800">%</span>
            </div>
          </div>
        </div>
        
        <div class="flex space-x-3">
          <button class="flex-1 h-10 bg-blue text-gray-700 px-4 rounded-lg border border-gray-300 hover:bg-gray-50 cancel-humidity">İptal et</button>
          <button class="flex-1 h-10 bg-blue-500 text-white px-4 rounded-lg hover:bg-blue-600 update-humidity">Güncelle</button>
        </div>
      </div>
    `;
  
    const popup = L.popup({
      className: 'custom-humidity-popup',
      maxWidth: 300,
      closeButton: false,
      offset: [-50, 220]
    })
      .setLatLng([lat, lng])
      .setContent(humidityPopupContent)
      .openOn(this.map);
  
    setTimeout(() => {
      const cancelButton = document.querySelector('.cancel-humidity');
      const updateButton = document.querySelector('.update-humidity');
      const humidityInput = document.getElementById('new-humidity') as HTMLInputElement;
  
      if (cancelButton) {
        cancelButton.addEventListener('click', () => {
          popup.remove();
          this.resetMapPopup(lat, lng);
        });
      }
  
      if (updateButton && humidityInput) {
        updateButton.addEventListener('click', () => {
          const newHumidity = humidityInput.value;
          this.updateHumidity(lat, lng, newHumidity);
          popup.remove();
          this.resetMapPopup(lat, lng);
        });
      }
    }, 100);
  }

  private updateHumidity(lat: number, lng: number, newHumidity: string): void {
    const location = this.locations.find(loc => loc.lat === lat && loc.lng === lng);
    if (location) {
      location.damp = newHumidity;
      
      const marker = this.markers.get(location.name.toLowerCase());
      if (marker) {
        const newPopupContent = this.createPopupContent(location);
        marker.unbindPopup();
        const popup = L.popup({
          className: 'custom-popup',
          maxWidth: 400,
          closeButton: false,
          offset: [-50, 220]
        }).setContent(newPopupContent);
        
        marker.bindPopup(popup);
      }

      this.filteredLocations = [...this.locations];
    }
  }

  private resetMapPopup(lat: number, lng: number): void {
    const location = this.locations.find(loc => loc.lat === lat && loc.lng === lng);
    if (location) {
      const marker = this.markers.get(location.name.toLowerCase());
      if (marker) {
        const newPopupContent = this.createPopupContent(location);
        marker.unbindPopup();
        const popup = L.popup({
          className: 'custom-popup',
          maxWidth: 300,
          closeButton: false,
          offset: [-50, 220]
        }).setContent(newPopupContent);
        
        marker.bindPopup(popup);
        marker.openPopup();
  
        marker.off('popupopen').on('popupopen', () => {
          const temperatureButton = document.querySelector(
            `.temperature-button[data-lat="${lat}"][data-lng="${lng}"]`
          );
          if (temperatureButton) {
            temperatureButton.addEventListener('click', () => {
              const currentTemp = temperatureButton.getAttribute('data-temp') || '0';
              this.openTemperaturePopup(lat, lng, currentTemp);
            });
          }
  
          const humidityButton = document.querySelector(
            `.humidity-button[data-lat="${lat}"][data-lng="${lng}"]`
          );
          if (humidityButton) {
            humidityButton.addEventListener('click', () => {
              const currentHumidity = humidityButton.getAttribute('data-humidity') || '0';
              this.openHumidityPopup(lat, lng, currentHumidity);
            });
          }
        });
      }
    }
  }
  private initMap(): void {
    if (!this.map) {
      const container = L.DomUtil.get('map');
      
      if (container != null) {
        (container as any)._leaflet_id = null;
      }

      setTimeout(() => {
        this.map = L.map('map', {
          center: [39.8283, -98.5795],
          zoom: 4
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
          maxZoom: 19
        }).addTo(this.map);

        this.addMarkers();
      }, 0);
    }
  }

  private addMarkers(): void {
    const customIcon = L.divIcon({
      html: `<svg width="81" height="101" viewBox="0 0 81 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g filter="url(#filter0_f_45_8376)">
                <ellipse cx="40.5" cy="82.5" rx="24.5" ry="2.5" fill="black" fill-opacity="0.4"/>
              </g>
              <path d="M66 25C66 38.8071 51 65 41 80.5C31 65 16 38.8071 16 25C16 11.1929 27.1929 0 41 0C54.8071 0 66 11.1929 66 25Z" fill="#007DFC"/>
              <circle cx="41" cy="25" r="9" fill="white"/>
              <defs>
                <filter id="filter0_f_45_8376" x="0" y="64" width="81" height="37" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                  <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                  <feGaussianBlur stdDeviation="8" result="effect1_foregroundBlur_45_8376"/>
                </filter>
              </defs>
            </svg>`,
      className: 'custom-marker',
      iconSize: [40, 50],
      iconAnchor: [20, 50],
      popupAnchor: [-80, 20]
    });

    this.locations.forEach(loc => {
      const marker = L.marker([loc.lat, loc.lng], {
        icon: customIcon,
      }).addTo(this.map);

      const markerElement = marker.getElement();
      const element = markerElement || null;

      if (element) {
        element.style.setProperty('z-index', '40', 'important');
      }

      this.markers.set(loc.name.toLowerCase(), marker);

      const popupContent = `
        <div class="bg-white p-4 rounded-lg min-w-[300px]">
          <h3 class="text-xl font-semibold mb-4">Nem ve Sıcaklık Sensörü</h3>
          <p class="text-gray-600 mb-4">${loc.name}</p>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-2">
              <svg width="24" height="31" viewBox="0 0 24 31" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.1791 17.7152V3.34904C14.025 -1.10831 7.59574 -1.12437 7.43618 3.34904V17.7152C1.35314 21.204 3.78643 30.4895 10.805 30.5523C12.8399 30.5496 14.7686 29.6453 16.071 28.0809C17.3735 26.5179 17.915 24.457 17.5495 22.4563C17.1839 20.4541 15.9496 18.7179 14.1793 17.7155L14.1791 17.7152ZM10.8048 28.4067C8.62258 28.3999 6.72805 26.8969 6.22771 24.772C5.72579 22.6484 6.74736 20.4568 8.69772 19.4746C9.24192 19.2032 9.58563 18.6453 9.58291 18.037V3.34932C9.58154 3.02471 9.71112 2.71103 9.94024 2.48187C10.1707 2.25137 10.4831 2.12182 10.8077 2.12182C11.1337 2.12182 11.446 2.25139 11.6765 2.48187C11.9056 2.71101 12.0352 3.02471 12.0338 3.34932V18.037C12.0311 18.644 12.3721 19.2004 12.9135 19.4746C14.8667 20.4539 15.8909 22.647 15.389 24.7734C14.8871 26.8997 12.9898 28.4039 10.8048 28.4067Z" fill="#007DFC"/>
              <path d="M10.805 20.4731C9.03465 20.4786 7.60254 21.9161 7.60254 23.6865C7.7553 27.942 13.8629 27.935 14.0127 23.6865C14.0127 21.9134 12.578 20.4759 10.805 20.4731Z" fill="#007DFC"/>
              <path d="M1.15516 6.08416H5.61252C5.90575 6.08007 6.14034 5.84139 6.14034 5.54813C6.14034 5.25353 5.90575 5.01486 5.61252 5.01074H1.15516C0.861924 5.01483 0.625977 5.25352 0.625977 5.54813C0.625977 5.84137 0.861931 6.08004 1.15516 6.08416Z" fill="#007DFC"/>
              <path d="M6.14844 9.02846C6.14844 8.88661 6.09116 8.74886 5.99159 8.6493C5.89066 8.54838 5.75427 8.49109 5.61244 8.49246H0.534631C0.238663 8.49246 0 8.7325 0 9.02848C0 9.32445 0.238681 9.56312 0.534631 9.56451H5.61244C5.75429 9.56451 5.89067 9.50859 5.99159 9.40766C6.09116 9.30673 6.14844 9.17029 6.14844 9.02846Z" fill="#007DFC"/>
              <path d="M2.12879 11.9731C1.83556 11.9772 1.59961 12.2159 1.59961 12.5092C1.59961 12.8024 1.83556 13.0411 2.12879 13.0452H5.61221C5.90544 13.0411 6.14003 12.8024 6.14003 12.5092C6.14003 12.2159 5.90544 11.9773 5.61221 11.9731H2.12879Z" fill="#007DFC"/>
              <path d="M6.14829 15.9901C6.14829 15.8483 6.09101 15.7119 5.99144 15.611C5.89051 15.51 5.75412 15.4541 5.61229 15.4541H1.15493C1.01172 15.4528 0.875335 15.51 0.774421 15.6096C0.673494 15.7105 0.616211 15.8469 0.616211 15.9901C0.616211 16.1333 0.673494 16.2697 0.774421 16.3706C0.875349 16.4702 1.01174 16.5275 1.15493 16.5261H5.61229C5.75414 16.5261 5.89052 16.4702 5.99144 16.3693C6.09101 16.2683 6.14829 16.132 6.14829 15.9901Z" fill="#007DFC"/>
              <path d="M16.3733 2.98106C16.6666 3.02743 16.9407 2.82831 16.9871 2.53508L17.2026 1.1712C17.2489 0.879324 17.0484 0.603817 16.7566 0.557449C16.4633 0.511077 16.1892 0.711571 16.1428 1.00343L15.9273 2.36731C15.9055 2.50916 15.9396 2.65237 16.0228 2.76692C16.1074 2.88285 16.2328 2.95924 16.3733 2.98106Z" fill="#007DFC"/>
              <path d="M18.9599 14.9999C18.8235 14.7407 18.5043 14.6384 18.2425 14.7721C17.9806 14.9044 17.8756 15.2222 18.0038 15.4854L18.6298 16.7157C18.6939 16.8439 18.8058 16.9407 18.9422 16.9857C19.0772 17.0307 19.2258 17.0198 19.3527 16.9544C19.4809 16.8902 19.5764 16.777 19.62 16.6407C19.6637 16.5043 19.6514 16.357 19.5859 16.2301L18.9599 14.9999Z" fill="#007DFC"/>
              <path d="M22.9231 12.4177L21.6942 11.7903C21.431 11.6607 21.1132 11.7657 20.9795 12.0276C20.8472 12.2881 20.9481 12.6087 21.2073 12.745C21.6765 13.0164 22.1688 13.2456 22.6789 13.4311C22.9244 13.427 23.1372 13.2578 23.1945 13.0192C23.2518 12.7805 23.1399 12.5323 22.9231 12.4177Z" fill="#007DFC"/>
              <path d="M23.3839 7.36601L22.0228 7.58151V7.58287C21.7336 7.63333 21.5386 7.90611 21.5849 8.19526C21.6313 8.4844 21.9014 8.68352 22.1905 8.64124L23.5517 8.42574H23.553C23.8422 8.37664 24.0386 8.10386 23.9936 7.81335C23.9472 7.52284 23.6758 7.32373 23.3839 7.36601Z" fill="#007DFC"/>
              <path d="M21.5538 3.00697C21.4529 2.90604 21.3165 2.84876 21.1733 2.85012C21.0315 2.85012 20.8951 2.90604 20.7942 3.00697L19.8203 3.98353C19.7194 4.08446 19.6621 4.22085 19.6621 4.36404C19.6621 4.50589 19.7194 4.64364 19.8203 4.7432C19.9212 4.84412 20.0576 4.90141 20.2008 4.90004C20.3427 4.90004 20.4791 4.84276 20.58 4.74183L21.5538 3.76527C21.7639 3.55523 21.7625 3.21566 21.5538 3.00697Z" fill="#007DFC"/>
              <path d="M15.397 4.22363C15.3493 4.22363 15.3002 4.225 15.2524 4.22909V14.1214C16.5754 14.1583 17.8588 13.6632 18.8135 12.7466C19.7696 11.8301 20.3179 10.5698 20.337 9.24562C20.3561 7.92262 19.8446 6.64603 18.9172 5.70236C17.9883 4.75991 16.7213 4.22636 15.397 4.22363Z" fill="#007DFC"/>
              </svg>
              <span class="text-2xl">${loc.celcius} °C</span>
            </div>
            <button class="bg-[#F2F9FF] text-blue-500 px-4 py-2 rounded-lg shadow-sm border border-gray-200 w-32 temperature-button" data-lat="${loc.lat}" data-lng="${loc.lng}" data-temp="${loc.celcius}">
              <span class="font-bold">Sıcaklık</span> Ayarla
            </button>
          </div>
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-2">
              <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.1243 17.3757C17.298 17.3757 17.4515 17.3555 17.5883 17.323C17.5401 18.4 17.298 19.4579 16.8901 20.4342C16.6323 20.3893 16.4743 20.2649 16.277 20.0991C15.9901 19.8648 15.6315 19.5746 14.9613 19.5746C14.2878 19.5746 13.9325 19.8648 13.6456 20.0991C13.3879 20.3086 13.2063 20.4577 12.7939 20.4577C12.3859 20.4577 12.201 20.3086 11.9466 20.0991C11.6597 19.8648 11.3056 19.5746 10.6309 19.5746C10.4292 19.5746 10.2633 19.7404 10.2633 19.9455C10.2633 20.1473 10.4292 20.3131 10.6309 20.3131C11.0389 20.3131 11.2238 20.4622 11.4782 20.6717C11.7651 20.906 12.1192 21.1962 12.7939 21.1962C13.4674 21.1962 13.8227 20.906 14.1096 20.6717C14.3673 20.4622 14.5489 20.3131 14.9613 20.3131C15.3693 20.3131 15.5542 20.4622 15.8086 20.6717C16.0058 20.8331 16.2367 21.0192 16.5752 21.1156C15.3805 23.4444 13.1975 25.2352 10.3609 25.6959C9.85766 25.7811 9.341 25.8215 8.81204 25.8215C8.28308 25.8215 7.76307 25.7811 7.25425 25.6959C1.36701 24.74 -1.70371 18.0853 0.979402 12.7595L6.77799 1.251C7.61741 -0.419981 10.0022 -0.415505 10.8417 1.25548L16.5751 12.6834C16.4743 12.6229 16.3813 12.5467 16.277 12.4615C15.9901 12.2272 15.6315 11.937 14.9613 11.937C14.2877 11.937 13.9325 12.2273 13.6456 12.4615C13.3878 12.6677 13.2063 12.8201 12.7938 12.8201C12.3859 12.8201 12.201 12.6666 11.9466 12.4615C11.6597 12.2272 11.3055 11.937 10.6309 11.937C10.4292 11.937 10.2633 12.0984 10.2633 12.3046C10.2633 12.5063 10.4292 12.6722 10.6309 12.6722C11.0388 12.6722 11.2237 12.8257 11.4781 13.0308C11.765 13.265 12.1192 13.5553 12.7938 13.5553C13.4674 13.5553 13.8226 13.265 14.1096 13.0308C14.3673 12.8246 14.5489 12.6722 14.9613 12.6722C15.3693 12.6722 15.5542 12.8257 15.8086 13.0308C16.0708 13.2448 16.3981 13.5071 16.9663 13.5474C17.354 14.5325 17.5558 15.5412 17.5916 16.5453C17.4661 16.6013 17.3215 16.6383 17.1232 16.6383C16.7152 16.6383 16.5303 16.4892 16.2759 16.2797C15.989 16.0499 15.6304 15.7552 14.9602 15.7552C14.2867 15.7552 13.9314 16.0499 13.6445 16.2797C13.3867 16.4892 13.2052 16.6383 12.7928 16.6383C12.3848 16.6383 12.1999 16.4892 11.9455 16.2797C11.6586 16.0499 11.3044 15.7552 10.6298 15.7552C10.4281 15.7552 10.2622 15.921 10.2622 16.1261C10.2622 16.3279 10.4281 16.4937 10.6298 16.4937C11.0377 16.4937 11.2227 16.6473 11.477 16.8524C11.764 17.0866 12.1181 17.3768 12.7928 17.3768C13.4663 17.3768 13.8216 17.0866 14.1085 16.8524C14.3662 16.6461 14.5478 16.4937 14.9602 16.4937C15.3682 16.4937 15.5531 16.6473 15.8075 16.8524C16.0955 17.0855 16.4552 17.3757 17.1243 17.3757ZM23.6335 11.9357C22.96 11.9357 22.6002 12.226 22.3144 12.4602C22.06 12.6664 21.8751 12.8188 21.4627 12.8188C21.0514 12.8188 20.8654 12.6653 20.6109 12.4602C20.324 12.226 19.9654 11.9357 19.2918 11.9357C18.6217 11.9357 18.263 12.226 17.9761 12.4602C17.7217 12.6664 17.5368 12.8188 17.1244 12.8188C16.8823 12.8188 16.7209 12.7661 16.5752 12.6821L16.6279 12.783C16.7534 13.0329 16.8655 13.2917 16.9664 13.5462C17.019 13.554 17.0717 13.554 17.1233 13.554C17.7968 13.554 18.1566 13.2638 18.4423 13.0295C18.6967 12.8233 18.8817 12.6709 19.2896 12.6709C19.7009 12.6709 19.8869 12.8244 20.1447 13.0295C20.4316 13.2638 20.7858 13.554 21.4604 13.554C22.134 13.554 22.4892 13.2638 22.7795 13.0295C23.0339 12.8233 23.2188 12.6709 23.6313 12.6709C23.833 12.6709 23.9988 12.505 23.9988 12.3033C24.0011 12.0971 23.8353 11.9357 23.6335 11.9357ZM23.6335 15.7541C22.96 15.7541 22.6002 16.0488 22.3144 16.2786C22.06 16.4881 21.8751 16.6372 21.4627 16.6372C21.0514 16.6372 20.8654 16.4881 20.6109 16.2786C20.324 16.0488 19.9654 15.7541 19.2918 15.7541C18.6217 15.7541 18.263 16.0488 17.9761 16.2786C17.8428 16.3873 17.7296 16.4803 17.5929 16.5453C17.6052 16.8076 17.6007 17.0653 17.5884 17.3242C17.9795 17.2312 18.2294 17.0261 18.4435 16.8524C18.6979 16.6462 18.8828 16.4937 19.2907 16.4937C19.702 16.4937 19.8881 16.6473 20.1459 16.8524C20.4328 17.0866 20.7869 17.3769 21.4616 17.3769C22.1351 17.3769 22.4904 17.0866 22.7807 16.8524C23.0351 16.6462 23.22 16.4937 23.6324 16.4937C23.8341 16.4937 24 16.3279 24 16.1262C24.0011 15.9188 23.8353 15.7541 23.6335 15.7541ZM23.6335 19.5745C22.96 19.5745 22.6002 19.8647 22.3144 20.099C22.06 20.3085 21.8751 20.4576 21.4627 20.4576C21.0514 20.4576 20.8654 20.3085 20.6109 20.099C20.324 19.8647 19.9654 19.5745 19.2918 19.5745C18.6183 19.5745 18.263 19.8647 17.9761 20.099C17.7217 20.3085 17.5368 20.4576 17.1244 20.4576C17.0358 20.4576 16.9585 20.4498 16.8902 20.4329C16.7971 20.6672 16.6929 20.8924 16.5752 21.1143C16.7321 21.167 16.9137 21.195 17.1244 21.195C17.7979 21.195 18.1577 20.9048 18.4435 20.6705C18.6979 20.461 18.8828 20.3119 19.2907 20.3119C19.702 20.3119 19.8881 20.461 20.1425 20.6705C20.4327 20.9048 20.788 21.195 21.4616 21.195C22.1351 21.195 22.4904 20.9048 22.7807 20.6705C23.0351 20.461 23.22 20.3119 23.6324 20.3119C23.8341 20.3119 24 20.146 24 19.9443C24.0011 19.7404 23.8353 19.5745 23.6335 19.5745Z" fill="#007DFC"/>
              </svg>
              <span class="text-2xl">% ${loc.damp}</span>
            </div>
            <button class="bg-[#F2F9FF] text-blue-500 px-4 py-2 rounded-lg shadow-sm border border-gray-200 w-32 humidity-button" data-lat="${loc.lat}" data-lng="${loc.lng}" data-humidity="${loc.damp}">
              <span class="font-bold">Nem</span> Ayarla
            </button>
          </div>
        </div>
      `;

      const popup = L.popup({
        className: 'custom-popup',
        maxWidth: 400,
        closeButton: false,
        offset: [-50, 220]
      }).setContent(popupContent);

      marker.bindPopup(popup);

      marker.on('click', () => {
        if (element) {
          this.setActiveMarker(element);
        }
        this.setActiveWidget(`widget-${loc.name.toLowerCase()}`);
      });

      marker.on('popupopen', () => {
        const temperatureButton = document.querySelector(`.temperature-button[data-lat="${loc.lat}"][data-lng="${loc.lng}"]`);
        if (temperatureButton) {
          temperatureButton.addEventListener('click', () => {
            const currentTemp = temperatureButton.getAttribute('data-temp') || '0';
            this.openTemperaturePopup(loc.lat, loc.lng, currentTemp);
          });
        }

        const humidityButton = document.querySelector(`.humidity-button[data-lat="${loc.lat}"][data-lng="${loc.lng}"]`);
        if (humidityButton) {
          humidityButton.addEventListener('click', () => {
            const currentHumidity = humidityButton.getAttribute('data-humidity') || '0';
            this.openHumidityPopup(loc.lat, loc.lng, currentHumidity);
          });
        }
      });

      popup.on('remove', () => {
        if (element) {
          element.classList.remove('active-marker');
          element.style.setProperty('z-index', '40', 'important');
        }
      });
    });
  }
}