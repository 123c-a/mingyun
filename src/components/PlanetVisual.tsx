import React from 'react'

interface PlanetVisualProps {
  type: 'sun' | 'moon' | 'mercury' | 'venus' | 'earth' | 'mars' | 'jupiter' | 'saturn' | 'uranus' | 'neptune'
  size: number
}

export default function PlanetVisual({ type, size }: PlanetVisualProps) {
  const getPlanetStyles = () => {
    const baseSize = size
    
    switch (type) {
      case 'sun':
        return {
          background: 'radial-gradient(circle at 30% 30%, #fff7e0 0%, #ffd700 30%, #ff8c00 60%, #ff4500 100%)',
          boxShadow: '0 0 60px #ffd700, 0 0 100px #ffaa00, 0 0 150px #ff880080',
          borderRadius: '50%',
          animation: 'sunGlow 3s ease-in-out infinite'
        }
      
      case 'moon':
        return {
          background: 'radial-gradient(circle at 30% 30%, #f5f5f5 0%, #c0c0c0 40%, #808080 100%)',
          boxShadow: 'inset -8px -8px 20px rgba(0,0,0,0.4), 0 0 20px rgba(192,192,192,0.5)',
          borderRadius: '50%'
        }
      
      case 'mercury':
        return {
          background: 'radial-gradient(circle at 30% 30%, #d4d4d4 0%, #8b7355 50%, #5c4033 100%)',
          boxShadow: 'inset -5px -5px 15px rgba(0,0,0,0.5), 0 0 15px rgba(139,115,85,0.4)',
          borderRadius: '50%'
        }
      
      case 'venus':
        return {
          background: 'radial-gradient(circle at 30% 30%, #fff5e6 0%, #e6c87a 40%, #c9a227 100%)',
          boxShadow: 'inset -6px -6px 18px rgba(0,0,0,0.3), 0 0 25px rgba(230,200,122,0.6)',
          borderRadius: '50%'
        }
      
      case 'earth':
        return {
          background: 'radial-gradient(circle at 30% 30%, #87ceeb 0%, #4169e1 30%, #228b22 50%, #f5f5dc 70%, #4169e1 100%)',
          boxShadow: 'inset -7px -7px 20px rgba(0,0,0,0.4), 0 0 30px rgba(65,105,225,0.6)',
          borderRadius: '50%'
        }
      
      case 'mars':
        return {
          background: 'radial-gradient(circle at 30% 30%, #ff6347 0%, #cd5c5c 40%, #8b0000 100%)',
          boxShadow: 'inset -6px -6px 18px rgba(0,0,0,0.5), 0 0 20px rgba(205,92,92,0.5)',
          borderRadius: '50%'
        }
      
      case 'jupiter':
        return {
          background: `
            radial-gradient(circle at 30% 30%, #fff8dc 0%, #daa520 20%, #cd853f 35%, #f5deb3 45%, #d2691e 55%, #daa520 70%, #8b4513 100%)
          `,
          boxShadow: 'inset -10px -10px 30px rgba(0,0,0,0.4), 0 0 40px rgba(218,165,32,0.6)',
          borderRadius: '50%'
        }
      
      case 'saturn':
        return {
          background: 'radial-gradient(circle at 30% 30%, #fffacd 0%, #f4a460 40%, #daa520 100%)',
          boxShadow: 'inset -9px -9px 25px rgba(0,0,0,0.4), 0 0 35px rgba(244,164,96,0.6)',
          borderRadius: '50%'
        }
      
      case 'uranus':
        return {
          background: 'radial-gradient(circle at 30% 30%, #e0ffff 0%, #40e0d0 40%, #20b2aa 100%)',
          boxShadow: 'inset -8px -8px 22px rgba(0,0,0,0.3), 0 0 25px rgba(64,224,208,0.5)',
          borderRadius: '50%'
        }
      
      case 'neptune':
        return {
          background: 'radial-gradient(circle at 30% 30%, #87ceeb 0%, #4169e1 40%, #000080 100%)',
          boxShadow: 'inset -8px -8px 22px rgba(0,0,0,0.4), 0 0 30px rgba(65,105,225,0.6)',
          borderRadius: '50%'
        }
      
      default:
        return {
          background: '#888',
          boxShadow: '0 0 10px rgba(136,136,136,0.5)',
          borderRadius: '50%'
        }
    }
  }
  
  const styles = getPlanetStyles()
  
  return (
    <>
      <div
        className="relative"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          ...styles
        }}
      >
        {/* 土星环 */}
        {type === 'saturn' && (
          <div
            className="absolute"
            style={{
              width: `${size * 2.2}px`,
              height: `${size * 0.6}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%) rotateX(75deg)',
              border: '3px solid #daa520',
              borderRadius: '50%',
              boxShadow: '0 0 15px rgba(218,165,32,0.5), inset 0 0 10px rgba(218,165,32,0.3)'
            }}
          />
        )}
        
        {/* 天王星环 */}
        {type === 'uranus' && (
          <div
            className="absolute"
            style={{
              width: `${size * 2}px`,
              height: `${size * 0.4}px`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%) rotateX(80deg)',
              border: '2px solid #40e0d0',
              borderRadius: '50%',
              boxShadow: '0 0 10px rgba(64,224,208,0.4)'
            }}
          />
        )}
        
        {/* 木星条纹效果 */}
        {type === 'jupiter' && (
          <>
            <div
              className="absolute"
              style={{
                width: '100%',
                height: '20%',
                top: '30%',
                left: 0,
                background: 'rgba(139,69,19,0.4)',
                borderRadius: '50%'
              }}
            />
            <div
              className="absolute"
              style={{
                width: '100%',
                height: '15%',
                top: '55%',
                left: 0,
                background: 'rgba(205,133,63,0.3)',
                borderRadius: '50%'
              }}
            />
          </>
        )}
        
        {/* 地球云层 */}
        {type === 'earth' && (
          <div
            className="absolute"
            style={{
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              background: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 30%)',
              borderRadius: '50%',
              animation: 'cloudFloat 10s linear infinite'
            }}
          />
        )}
      </div>
      
      {/* CSS动画 */}
      <style>{`
        @keyframes sunGlow {
          0%, 100% { box-shadow: 0 0 60px #ffd700, 0 0 100px #ffaa00; }
          50% { box-shadow: 0 0 80px #ffd700, 0 0 130px #ffaa00, 0 0 160px #ff880080; }
        }
        
        @keyframes cloudFloat {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
