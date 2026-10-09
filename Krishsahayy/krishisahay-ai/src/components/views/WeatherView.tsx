import React from 'react';
import { CloudSun, Droplets, Wind, Sun, AlertTriangle, ArrowRight } from 'lucide-react';
import { FarmProfile } from '../../types/agricultural';

interface WeatherViewProps {
  farm: FarmProfile;
}

export const WeatherView: React.FC<WeatherViewProps> = ({ farm }) => {
  const forecastDays = [
    { day: 'Wed', icon: '⛅', temp: '29°C / 21°C', rain: '20%', cond: 'Partly Cloudy' },
    { day: 'Thu', icon: '☀️', temp: '34°C / 23°C', rain: '0%', cond: 'Hot & Clear' },
    { day: 'Fri', icon: '🌧️', temp: '26°C / 20°C', rain: '70%', cond: 'Moderate Rain' },
    { day: 'Sat', icon: '🌧️', temp: '25°C / 19°C', rain: '85%', cond: 'Heavy Showers' },
    { day: 'Sun', icon: '⛅', temp: '28°C / 21°C', rain: '30%', cond: 'Scattered Clouds' },
    { day: 'Mon', icon: '☀️', temp: '31°C / 22°C', rain: '10%', cond: 'Clear Sky' },
    { day: 'Tue', icon: '⛅', temp: '30°C / 22°C', rain: '15%', cond: 'Partly Cloudy' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-cyan-100 text-cyan-800">
              <CloudSun className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
              Weather Intelligence & Micro-Climate Advisories
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Hyperlocal forecasts paired with rule-based agronomic advisory warnings for {farm.location}.
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          Updated: Live Radar
        </span>
      </div>

      {/* Main Current Weather & Advisory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weather Hero Card */}
        <div className="bg-gradient-to-br from-[#023e8a] via-[#0077b6] to-[#0096c7] rounded-3xl p-7 text-white shadow-md flex flex-col justify-between space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-white/70 uppercase tracking-wider">
                📍 {farm.location}
              </p>
              <div className="text-6xl font-black font-serif text-white mt-1">28°C</div>
              <p className="text-base text-cyan-100 font-semibold mt-1">⛅ Partly Cloudy</p>
            </div>
            <div className="text-7xl">⛅</div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="bg-white/15 p-2.5 rounded-2xl backdrop-blur-xs">
              <div className="font-black text-sm">72%</div>
              <div className="text-[10px] text-white/70 mt-0.5">Humidity</div>
            </div>
            <div className="bg-white/15 p-2.5 rounded-2xl backdrop-blur-xs">
              <div className="font-black text-sm">15 km/h</div>
              <div className="text-[10px] text-white/70 mt-0.5">Wind (SE)</div>
            </div>
            <div className="bg-white/15 p-2.5 rounded-2xl backdrop-blur-xs">
              <div className="font-black text-sm">12 mm</div>
              <div className="text-[10px] text-white/70 mt-0.5">Rain (24h)</div>
            </div>
            <div className="bg-white/15 p-2.5 rounded-2xl backdrop-blur-xs">
              <div className="font-black text-sm">8 High</div>
              <div className="text-[10px] text-white/70 mt-0.5">UV Index</div>
            </div>
          </div>
        </div>

        {/* 4 Smart Farming Advisories */}
        <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm space-y-3 text-xs">
          <h3 className="font-bold text-emerald-950 uppercase font-serif tracking-wider mb-2">
            🌾 Live Agronomic Advisories
          </h3>

          <div className="p-3 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-950">
            <strong>💧 Irrigation Scheduling:</strong> Light showers expected Friday — skip heavy irrigation today to preserve 40% groundwater.
          </div>

          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950">
            <strong>🌡️ Heatwave Alert:</strong> Thursday temperature peaking at 34°C. Run foliar sprinkler mists during morning hours only.
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
            <strong>🌱 Sowing Recommendation:</strong> Next 48 hours provide an optimal biological window for Kharif pulse and cereal sowing.
          </div>

          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-950">
            <strong>🍄 Fungal Disease Vector:</strong> High relative humidity (&gt;70%) amplifies Rice Blast and Tomato blight risks. Inspect foliage.
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Grid */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm">
        <h3 className="font-bold text-emerald-950 uppercase font-serif tracking-wider mb-4 text-xs">
          7-Day Hyperlocal Weather Forecast
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs text-center">
          {forecastDays.map((f, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
              <div className="font-bold text-stone-500 uppercase text-[10px]">{f.day}</div>
              <div className="text-3xl my-1.5">{f.icon}</div>
              <div className="font-bold text-emerald-950 font-serif text-sm">{f.temp}</div>
              <div className="text-[10px] text-cyan-700 font-semibold mt-0.5">{f.rain} Rain</div>
              <div className="text-[10px] text-stone-400 mt-0.5">{f.cond}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
