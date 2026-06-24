import { useParams, useNavigate } from 'react-router-dom'
import { comboConfigs, planetNames } from '../data/comboConfigs'

export default function ComboNotFoundPage() {
  const { '*': comboPath = '' } = useParams()
  const navigate = useNavigate()

  const planetIds = comboPath.split('-').filter(Boolean)
  const validPlanetIds = planetIds.filter(id => planetNames[id])
  const allCombos = Object.values(comboConfigs)

  const findClosestCombos = () => {
    if (validPlanetIds.length === 0) return allCombos.slice(0, 5)
    return allCombos
      .map(combo => ({
        combo,
        matchCount: combo.planets.filter(p => validPlanetIds.includes(p)).length
      }))
      .filter(c => c.matchCount > 0)
      .sort((a, b) => b.matchCount - a.matchCount)
      .slice(0, 5)
      .map(c => c.combo)
  }

  const closestCombos = findClosestCombos()

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6" style={{ background: 'radial-gradient(ellipse at 30% 20%, #201840 0%, #0a0520 35%, #050310 70%, #020208 100%)' }}>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🌑</div>
          <h1 className="text-2xl font-bold text-amber-200 mb-2">星图未明</h1>
          <p className="text-amber-200/60 text-sm">这个组合还没有对应的星图</p>
        </div>

        {validPlanetIds.length > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-amber-200/5 border border-amber-200/10">
            <div className="text-[10px] text-amber-200/50 tracking-widest mb-2">你选择的行星</div>
            <div className="flex flex-wrap gap-2">
              {validPlanetIds.map(id => (
                <span key={id} className="px-2 py-1 rounded text-xs bg-amber-200/15 text-amber-200/80">
                  {planetNames[id]}
                </span>
              ))}
            </div>
          </div>
        )}

        {closestCombos.length > 0 && (
          <div className="mb-6">
            <div className="text-[10px] text-amber-200/50 tracking-widest mb-3">✨ 试试这些组合</div>
            <div className="space-y-2">
              {closestCombos.map(combo => (
                <div
                  key={combo.id}
                  onClick={() => navigate(`/combo/${combo.id}`)}
                  className="p-3 rounded-xl bg-amber-200/5 border border-amber-200/10 hover:bg-amber-200/10 hover:border-amber-200/20 cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-amber-200">{combo.name}</div>
                      <div className="text-[10px] text-amber-200/50 mt-0.5">
                        {combo.planets.map(p => planetNames[p]).join(' × ')}
                      </div>
                    </div>
                    <span className="text-amber-200/50 text-xs">→</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="w-full py-3 rounded-xl bg-amber-400/20 text-amber-200 hover:bg-amber-400/30 transition-all border border-amber-400/30 text-sm font-medium"
        >
          ← 返回星盘
        </button>
      </div>
    </div>
  )
}
