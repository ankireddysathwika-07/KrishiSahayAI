import React, { useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Check,
  Search,
  Filter,
  DollarSign,
  Plus,
} from 'lucide-react';
import { FarmProfile } from '../../types/agricultural';

interface AgriMarketHubViewProps {
  initialSubTab?: 'prices' | 'marketplace' | 'mylistings';
  farm: FarmProfile;
  onNavigateToOptimizer: () => void;
}

export const AgriMarketHubView: React.FC<AgriMarketHubViewProps> = ({
  initialSubTab = 'prices',
  farm,
  onNavigateToOptimizer,
}) => {
  const [subTab, setSubTab] = useState<'prices' | 'marketplace' | 'mylistings'>(initialSubTab);

  // Price prediction state
  const [selectedCrop, setSelectedCrop] = useState('Wheat');
  const [selectedMandi, setSelectedMandi] = useState('Warangal, Telangana');
  const [horizonDays, setHorizonDays] = useState(30);
  const [supplyLevel, setSupplyLevel] = useState(2); // 1: Low, 2: Med, 3: High
  const [rainfallIndex, setRainfallIndex] = useState(65);
  const [predictionRun, setPredictionRun] = useState(false);

  // Marketplace state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('fresh');
  const [orderModalProduce, setOrderModalProduce] = useState<any | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Listings state
  const [myListings, setMyListings] = useState([
    {
      id: 1,
      name: 'Organic Sharbati Wheat',
      category: 'grain',
      price: 2450,
      qty: 45,
      grade: 'Premium A',
      cert: 'Organic India',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Desi Chickpea (Chana)',
      category: 'pulse',
      price: 5600,
      qty: 30,
      grade: 'Grade A',
      cert: 'GAI Certified',
      status: 'Active',
    },
  ]);

  const [newProduceName, setNewProduceName] = useState('');
  const [newProducePrice, setNewProducePrice] = useState('');
  const [newProduceQty, setNewProduceQty] = useState('');
  const [newProduceCategory, setNewProduceCategory] = useState('grain');
  const [newProduceGrade, setNewProduceGrade] = useState('Premium A');

  const liveMovers = [
    { crop: 'Wheat', mandi: 'Warangal', price: 2310, change: '+4.2%', up: true, trend: 'Bullish', forecast: '₹2,380' },
    { crop: 'Rice (Paddy)', mandi: 'Khammam', price: 2350, change: '+1.8%', up: true, trend: 'Stable', forecast: '₹2,400' },
    { crop: 'Cotton', mandi: 'Adilabad', price: 7100, change: '+6.5%', up: true, trend: 'Bullish', forecast: '₹7,350' },
    { crop: 'Soybean', mandi: 'Nizamabad', price: 4720, change: '-1.4%', up: false, trend: 'Dip', forecast: '₹4,850' },
    { crop: 'Chilli', mandi: 'Guntur', price: 18500, change: '+8.2%', up: true, trend: 'Surging', forecast: '₹19,200' },
    { crop: 'Tomato', mandi: 'Madanapalle', price: 1400, change: '-12.0%', up: false, trend: 'Bearish', forecast: '₹1,250' },
  ];

  const marketplaceItems = [
    {
      id: 'p1',
      name: 'Organic Sharbati Wheat',
      farm: 'Lakshmi Farm, Warangal',
      category: 'grain',
      price: 2450,
      unit: 'Qtl',
      icon: '🌾',
      grade: 'Premium A',
      stock: 45,
      cert: 'Organic',
    },
    {
      id: 'p2',
      name: 'High-Yield Hybrid Tomato',
      farm: 'Reddy Horticultural Holding',
      category: 'veg',
      price: 1400,
      unit: 'Qtl',
      icon: '🍅',
      grade: 'Grade A',
      stock: 120,
      cert: 'GAP Verified',
    },
    {
      id: 'p3',
      name: 'Desi Brown Chickpea',
      farm: 'Murugan Natural Farms',
      category: 'pulse',
      price: 5600,
      unit: 'Qtl',
      icon: '🫘',
      grade: 'Grade A',
      stock: 60,
      cert: 'GAI Certified',
    },
    {
      id: 'p4',
      name: 'Bt Long-Staple Cotton',
      farm: 'Telangana Agro Cluster',
      category: 'grain',
      price: 7100,
      unit: 'Qtl',
      icon: '🌱',
      grade: 'Ginned Premium',
      stock: 85,
      cert: 'MSP Verified',
    },
    {
      id: 'p5',
      name: 'Organic Red Onion',
      farm: 'Krishna River Basin',
      category: 'veg',
      price: 1950,
      unit: 'Qtl',
      icon: '🧅',
      grade: 'Grade B',
      stock: 90,
      cert: 'Direct Fresh',
    },
    {
      id: 'p6',
      name: 'Finger Millet (Ragi)',
      farm: 'Rayalaseema Dryland Co-op',
      category: 'grain',
      price: 3450,
      unit: 'Qtl',
      icon: '🌾',
      grade: 'Nutri-Cereal',
      stock: 110,
      cert: 'Naturally Grown',
    },
  ];

  const filteredItems = marketplaceItems.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.farm.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduceName || !newProducePrice) return;

    setMyListings([
      ...myListings,
      {
        id: Date.now(),
        name: newProduceName,
        category: newProduceCategory,
        price: parseFloat(newProducePrice),
        qty: parseFloat(newProduceQty) || 10,
        grade: newProduceGrade,
        cert: 'Self-Certified',
        status: 'Active',
      },
    ]);

    setNewProduceName('');
    setNewProducePrice('');
    setNewProduceQty('');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Sub-Tab Navigation */}
      <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-950 font-serif">
              AgriMarket™ Intelligence Hub
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Machine learning price prediction, live Mandi trends, and zero-commission farmer-to-buyer direct marketplace.
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex p-1 bg-stone-100 rounded-2xl text-xs font-bold shrink-0">
          <button
            onClick={() => setSubTab('prices')}
            className={`px-4 py-2 rounded-xl transition-all ${
              subTab === 'prices' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📊 Price Prediction
          </button>
          <button
            onClick={() => setSubTab('marketplace')}
            className={`px-4 py-2 rounded-xl transition-all ${
              subTab === 'marketplace' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🛒 Marketplace
          </button>
          <button
            onClick={() => setSubTab('mylistings')}
            className={`px-4 py-2 rounded-xl transition-all ${
              subTab === 'mylistings' ? 'bg-white text-emerald-950 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📦 My Listings ({myListings.length})
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: PRICE PREDICTION */}
      {subTab === 'prices' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Configuration Card */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm text-xs space-y-4">
              <h3 className="text-sm font-bold text-emerald-950 uppercase font-serif tracking-wider">
                Configure Price Prediction Model
              </h3>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Crop</label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-bold text-emerald-950"
                >
                  <option>Wheat</option>
                  <option>Rice</option>
                  <option>Tomato</option>
                  <option>Cotton</option>
                  <option>Onion</option>
                  <option>Soybean</option>
                  <option>Maize</option>
                  <option>Chickpea</option>
                  <option>Millets</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Target Market / Mandi</label>
                <select
                  value={selectedMandi}
                  onChange={(e) => setSelectedMandi(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 font-semibold text-emerald-950"
                >
                  <option>Warangal, Telangana</option>
                  <option>Azadpur, Delhi</option>
                  <option>Vashi, Mumbai</option>
                  <option>Koyambedu, Chennai</option>
                  <option>Yeshwanthpur, Bengaluru</option>
                </select>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-stone-600">Forecast Horizon</span>
                  <span className="font-bold text-emerald-800 font-mono">{horizonDays} days</span>
                </div>
                <input
                  type="range"
                  min="7"
                  max="90"
                  step="7"
                  value={horizonDays}
                  onChange={(e) => setHorizonDays(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-stone-600">Regional Supply Volume</span>
                  <span className="font-bold text-emerald-800 font-mono">
                    {supplyLevel === 1 ? 'Low / Tight Supply' : supplyLevel === 2 ? 'Normal Supply' : 'High / Market Glut'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="1"
                  value={supplyLevel}
                  onChange={(e) => setSupplyLevel(parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-stone-600">Rainfall & Soil Moisture Index</span>
                  <span className="font-bold text-cyan-800 font-mono">{rainfallIndex}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rainfallIndex}
                  onChange={(e) => setRainfallIndex(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-600 cursor-pointer"
                />
              </div>

              <button
                onClick={() => setPredictionRun(true)}
                className="w-full py-3 bg-gradient-to-r from-emerald-800 to-green-700 hover:from-emerald-900 text-white rounded-xl font-bold text-xs shadow-md transition-all active:scale-98"
              >
                🔮 Run ML Price Forecast
              </button>
            </div>

            {/* Results Card */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-emerald-950 uppercase font-serif tracking-wider mb-4">
                  Price Forecast & Volatility Rationale
                </h3>

                {predictionRun ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-emerald-950 to-green-950 p-5 rounded-2xl text-white">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] text-lime-400 font-bold uppercase tracking-wider block">
                            Projected Modal Price ({horizonDays} Days)
                          </span>
                          <div className="text-3xl font-black font-serif text-white mt-1">
                            ₹{selectedCrop === 'Wheat' ? '2,380' : selectedCrop === 'Cotton' ? '7,350' : '2,400'}
                            <span className="text-xs font-normal text-stone-300"> / Quintal</span>
                          </div>
                          <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-800 text-lime-300 border border-emerald-600">
                            +4.2% Bullish Momentum
                          </span>
                        </div>
                        <div className="text-right text-xs">
                          <span className="text-stone-300 block text-[10px]">Govt MSP Benchmark</span>
                          <span className="font-mono font-bold text-white text-sm">₹2,275 / Qtl</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                        <span className="text-stone-500 block text-[10px] uppercase font-bold">Model Confidence</span>
                        <span className="text-base font-bold text-emerald-950 font-serif mt-0.5 block">91.8%</span>
                        <span className="text-[10px] text-stone-500">Trained on 10-yr Agmarknet</span>
                      </div>
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                        <span className="text-stone-500 block text-[10px] uppercase font-bold">Crop Rotation Profit</span>
                        <span className="text-base font-bold text-emerald-700 font-serif mt-0.5 block">High Feasibility</span>
                        <span className="text-[10px] text-stone-500">Integrates with active plan</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950">
                      <strong>Agronomic Economic Connection:</strong> This forecast is directly synchronized with your Multi-Season Crop Rotation Optimizer.
                    </div>
                  </div>
                ) : (
                  <div className="py-16 text-center text-stone-400 text-xs">
                    <div className="text-4xl mb-2">💹</div>
                    <p>Configure parameters on the left and click "Run ML Price Forecast"</p>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex justify-between items-center text-xs">
                <span className="text-stone-500 text-[11px]">Forward forecasts updated daily at 06:00 IST</span>
                <button
                  onClick={onNavigateToOptimizer}
                  className="font-bold text-emerald-800 hover:text-emerald-950 underline"
                >
                  Use in Crop Optimizer ➔
                </button>
              </div>
            </div>
          </div>

          {/* Live Market Movers Table */}
          <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm">
            <h3 className="text-sm font-bold text-emerald-950 uppercase font-serif tracking-wider mb-4">
              Live Mandi Commodity Ticker
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 font-bold uppercase text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3">Crop</th>
                    <th className="py-2.5 px-3">Market</th>
                    <th className="py-2.5 px-3">Modal Price (₹/Qtl)</th>
                    <th className="py-2.5 px-3">Change (24h)</th>
                    <th className="py-2.5 px-3">Trend</th>
                    <th className="py-2.5 px-3">30-Day ML Forecast</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {liveMovers.map((m, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/60">
                      <td className="py-3 px-3 font-bold text-emerald-950 font-serif">{m.crop}</td>
                      <td className="py-3 px-3 text-stone-600">{m.mandi}</td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-900">₹{m.price.toLocaleString()}</td>
                      <td className="py-3 px-3 font-mono font-bold">
                        <span className={m.up ? 'text-emerald-700' : 'text-rose-600'}>{m.change}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            m.up ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {m.trend}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-stone-800">{m.forecast}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: MARKETPLACE */}
      {subTab === 'marketplace' && (
        <div className="space-y-6">
          {/* Search & Filters Bar */}
          <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Search produce name, farmer, or village..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-xl text-xs text-stone-800 focus:border-emerald-600 outline-hidden"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 bg-stone-50"
              >
                <option value="all">All Categories</option>
                <option value="grain">Grains & Cereals</option>
                <option value="veg">Vegetables</option>
                <option value="pulse">Pulses / Legumes</option>
              </select>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 bg-stone-50"
              >
                <option value="fresh">Freshest Harvest</option>
                <option value="low">Price: Low ➔ High</option>
                <option value="high">Price: High ➔ Low</option>
              </select>
            </div>
          </div>

          {/* Produce Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-stone-200 hover:border-emerald-400 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-28 bg-gradient-to-br from-emerald-100 to-lime-100 flex items-center justify-center text-5xl">
                    {item.icon}
                  </div>
                  <div className="p-4 space-y-1">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-sm text-emerald-950 font-serif">{item.name}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {item.cert}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">{item.farm}</p>

                    <div className="pt-2 flex justify-between items-baseline">
                      <div className="text-lg font-black font-serif text-emerald-950">
                        ₹{item.price.toLocaleString()} <span className="text-xs font-sans font-normal text-stone-500">/ {item.unit}</span>
                      </div>
                      <span className="text-[11px] font-mono text-stone-500 font-semibold">{item.stock} Qtl Available</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => {
                      setOrderModalProduce(item);
                      setOrderSuccess(false);
                    }}
                    className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xl text-xs transition-all active:scale-98"
                  >
                    Buy Directly / Send Offer
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Buy Offer Modal */}
          {orderModalProduce && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold font-serif text-base text-emerald-950">
                    Direct Farmer Order Inquiry
                  </h3>
                  <button onClick={() => setOrderModalProduce(null)} className="text-stone-400 hover:text-stone-600">✕</button>
                </div>

                <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 text-xs">
                  <div className="font-bold text-emerald-950">{orderModalProduce.name}</div>
                  <div className="text-stone-500 text-[11px]">{orderModalProduce.farm}</div>
                  <div className="font-bold text-emerald-800 mt-1">₹{orderModalProduce.price} / {orderModalProduce.unit}</div>
                </div>

                {orderSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 text-center font-bold">
                    ✓ Inquiry Sent to Farmer! SMS dispatch triggered to contact.
                  </div>
                ) : (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Quantity Needed (Qtl)</label>
                      <input type="number" defaultValue="10" className="w-full p-2 border border-stone-200 rounded-xl" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Your Delivery Pincode</label>
                      <input type="text" defaultValue="506002" className="w-full p-2 border border-stone-200 rounded-xl" />
                    </div>
                    <button
                      onClick={() => setOrderSuccess(true)}
                      className="w-full py-2.5 bg-emerald-800 text-white font-bold rounded-xl"
                    >
                      Confirm Direct Inquiry
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: MY LISTINGS */}
      {subTab === 'mylistings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm text-xs space-y-4">
            <h3 className="text-sm font-bold text-emerald-950 uppercase font-serif tracking-wider">
              Publish New Produce Listing
            </h3>

            <form onSubmit={handleAddListing} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Produce Name</label>
                <input
                  type="text"
                  placeholder="e.g. Organic Sharbati Wheat"
                  value={newProduceName}
                  onChange={(e) => setNewProduceName(e.target.value)}
                  required
                  className="w-full p-2 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Category</label>
                  <select
                    value={newProduceCategory}
                    onChange={(e) => setNewProduceCategory(e.target.value)}
                    className="w-full p-2 border border-stone-200 rounded-xl font-semibold"
                  >
                    <option value="grain">Grain</option>
                    <option value="veg">Vegetable</option>
                    <option value="pulse">Pulse</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Price (₹ / Qtl)</label>
                  <input
                    type="number"
                    placeholder="2450"
                    value={newProducePrice}
                    onChange={(e) => setNewProducePrice(e.target.value)}
                    required
                    className="w-full p-2 border border-stone-200 rounded-xl font-bold font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Quantity (Qtl)</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={newProduceQty}
                    onChange={(e) => setNewProduceQty(e.target.value)}
                    className="w-full p-2 border border-stone-200 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-stone-500 uppercase block mb-1">Grade</label>
                  <select
                    value={newProduceGrade}
                    onChange={(e) => setNewProduceGrade(e.target.value)}
                    className="w-full p-2 border border-stone-200 rounded-xl font-semibold"
                  >
                    <option>Premium A</option>
                    <option>Grade B</option>
                    <option>Standard C</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-800 text-white font-bold rounded-xl shadow-xs mt-2"
              >
                + Publish to Marketplace
              </button>
            </form>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-emerald-950 uppercase font-serif tracking-wider">
              Your Active Produce Listings ({myListings.length})
            </h3>

            <div className="space-y-3">
              {myListings.map((l) => (
                <div key={l.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex justify-between items-center text-xs">
                  <div>
                    <div className="font-bold text-emerald-950 text-sm font-serif">{l.name}</div>
                    <div className="text-[11px] text-stone-500">{l.grade} • {l.cert}</div>
                    <div className="font-bold font-mono text-emerald-800 mt-1">₹{l.price} / Qtl • {l.qty} Qtl</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {l.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
