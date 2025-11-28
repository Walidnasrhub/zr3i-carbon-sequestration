import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function CarbonCalculator() {
  const { language } = useLanguage();
  const [farmSize, setFarmSize] = useState<number>(10);
  const [treeAge, setTreeAge] = useState<number>(5);

  // Carbon sequestration calculation
  // Average date palm sequesters 0.5 tons CO2/year when mature (5+ years)
  // Young trees (< 5 years) sequester less
  const calculateCarbonSequestration = (size: number, age: number) => {
    const treesPerHectare = 100; // Standard density
    const totalTrees = size * treesPerHectare;
    
    // CO2 sequestration rate increases with age
    let ratePerTree = 0.1; // tons CO2/year
    if (age >= 3) ratePerTree = 0.3;
    if (age >= 5) ratePerTree = 0.5;
    if (age >= 10) ratePerTree = 0.6;
    
    const annualCO2 = totalTrees * ratePerTree;
    const creditValue = annualCO2 * 15; // $15 per ton CO2
    
    return {
      trees: totalTrees,
      annualCO2,
      creditValue,
      monthlyIncome: creditValue / 12,
    };
  };

  const results = useMemo(() => calculateCarbonSequestration(farmSize, treeAge), [farmSize, treeAge]);

  const chartData = [
    {
      name: language === 'ar' ? 'السنة 1' : 'Year 1',
      co2: results.annualCO2 * 0.2,
      income: (results.annualCO2 * 0.2) * 15,
    },
    {
      name: language === 'ar' ? 'السنة 3' : 'Year 3',
      co2: results.annualCO2 * 0.6,
      income: (results.annualCO2 * 0.6) * 15,
    },
    {
      name: language === 'ar' ? 'السنة 5' : 'Year 5',
      co2: results.annualCO2,
      income: results.creditValue,
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Input Section */}
        <Card className="p-6 border-cyan-200">
          <h3 className="text-xl font-bold text-navy-900 mb-6">
            {language === 'ar' ? 'حاسبة الكربون' : 'Carbon Calculator'}
          </h3>
          
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-medium text-navy-900 mb-2 block">
                {language === 'ar' ? 'حجم المزرعة (هكتار)' : 'Farm Size (Hectares)'}
              </Label>
              <Input
                type="number"
                min="1"
                max="1000"
                value={farmSize}
                onChange={(e) => setFarmSize(Number(e.target.value))}
                className="border-cyan-200 focus:border-cyan-500"
              />
              <p className="text-xs text-navy-700 mt-2">
                {language === 'ar' 
                  ? `${results.trees.toLocaleString()} شجرة نخيل`
                  : `${results.trees.toLocaleString()} date palm trees`
                }
              </p>
            </div>

            <div>
              <Label className="text-sm font-medium text-navy-900 mb-2 block">
                {language === 'ar' ? 'متوسط عمر الأشجار (سنة)' : 'Average Tree Age (Years)'}
              </Label>
              <Input
                type="number"
                min="1"
                max="50"
                value={treeAge}
                onChange={(e) => setTreeAge(Number(e.target.value))}
                className="border-cyan-200 focus:border-cyan-500"
              />
            </div>
          </div>
        </Card>

        {/* Results Section */}
        <div className="space-y-4">
          <Card className="p-6 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50">
            <h4 className="text-sm font-semibold text-navy-900 mb-4">
              {language === 'ar' ? 'الإنتاجية السنوية' : 'Annual Productivity'}
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-navy-700 text-sm">{language === 'ar' ? 'CO₂ المعزول' : 'CO₂ Sequestered'}</span>
                <span className="text-2xl font-bold text-cyan-600">
                  {results.annualCO2.toFixed(1)} <span className="text-sm">tons</span>
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-navy-700 text-sm">{language === 'ar' ? 'قيمة الأرصدة' : 'Credit Value'}</span>
                <span className="text-2xl font-bold text-lime-600">
                  ${results.creditValue.toFixed(0)}
                </span>
              </div>
              <div className="border-t border-cyan-300 pt-3 flex justify-between items-center">
                <span className="text-navy-700 text-sm font-medium">{language === 'ar' ? 'الدخل الشهري' : 'Monthly Income'}</span>
                <span className="text-xl font-bold text-cyan-600">
                  ${results.monthlyIncome.toFixed(0)}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-4 border-lime-200 bg-lime-50">
            <p className="text-xs text-navy-700">
              {language === 'ar'
                ? '💡 بناءً على معدل 15 دولار لكل طن CO₂. قد تختلف الأسعار حسب ظروف السوق.'
                : '💡 Based on $15 per ton CO₂. Prices may vary based on market conditions.'
              }
            </p>
          </Card>
        </div>
      </div>

      {/* Projection Chart */}
      <Card className="p-6 border-cyan-200">
        <h4 className="text-lg font-bold text-navy-900 mb-6">
          {language === 'ar' ? 'توقعات النمو' : 'Growth Projection'}
        </h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0f2fe" />
            <XAxis dataKey="name" stroke="#475569" />
            <YAxis stroke="#475569" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#f0f9ff', border: '1px solid #06b6d4' }}
              formatter={(value: number) => value.toFixed(1)}
            />
            <Legend />
            <Bar dataKey="co2" fill="#06b6d4" name={language === 'ar' ? 'أطنان CO₂' : 'Tons CO₂'} />
            <Bar dataKey="income" fill="#c0ff00" name={language === 'ar' ? 'الدخل ($)' : 'Income ($)'} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Export Button */}
      <div className="text-center">
        <Button 
          className="bg-gradient-to-r from-cyan-600 to-lime-500 hover:from-cyan-700 hover:to-lime-600 text-white font-semibold px-8 py-6"
          onClick={() => {
            const report = `Zr3i Carbon Calculator Report\n\nFarm Size: ${farmSize} hectares\nAverage Tree Age: ${treeAge} years\n\nResults:\n- Total Trees: ${results.trees.toLocaleString()}\n- Annual CO₂ Sequestered: ${results.annualCO2.toFixed(1)} tons\n- Annual Credit Value: $${results.creditValue.toFixed(0)}\n- Monthly Income: $${results.monthlyIncome.toFixed(0)}`;
            const element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(report));
            element.setAttribute('download', 'zr3i-carbon-report.txt');
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }}
        >
          {language === 'ar' ? 'تحميل التقرير' : 'Download Report'}
        </Button>
      </div>
    </div>
  );
}
