import { useState, useEffect } from 'react'
import { unitCategories, convert, calculateFromDimensions } from './utils/conversions'

import './App.css'

function App() {
  const [category, setCategory] = useState('length')
  const [fromUnit, setFromUnit] = useState('meters')
  const [toUnit, setToUnit] = useState('kilometers')
  const [fromValue, setFromValue] = useState('')
  const [toValue, setToValue] = useState('')
  const [dimensions, setDimensions] = useState({
    length: { value: '', unit: 'meters' },
    width: { value: '', unit: 'meters' },
    height: { value: '', unit: 'meters' }
  })

  useEffect(() => {
    // Only proceed with conversion if we have a direct value or dimensions
    const fromUnitDetails = unitCategories[category].units[fromUnit]
    
    if (!fromUnitDetails.multiInput && fromValue === '') {
      setToValue('')
      return
    }

    if (fromUnitDetails.multiInput) {
      const isVolume = fromUnitDetails.multiInput.type === 'cubic'
      const requiredDimensions = isVolume ? ['length', 'width', 'height'] : ['length', 'width']
      
      // Check if any required dimension is missing
      const hasMissingDimension = requiredDimensions.some(dim => !dimensions[dim]?.value)
      if (hasMissingDimension) {
        setToValue('')
        return
      }

      const value = calculateFromDimensions(
        parseFloat(dimensions.length.value), dimensions.length.unit,
        parseFloat(dimensions.width.value), dimensions.width.unit,
        isVolume ? parseFloat(dimensions.height.value) : undefined,
        isVolume ? dimensions.height.unit : undefined
      )
      
      const result = convert(value, fromUnit, toUnit, category)
      setToValue(result.toFixed(6))
    } else {
      const result = convert(parseFloat(fromValue), fromUnit, toUnit, category)
      setToValue(result.toFixed(6))
    }
  }, [fromValue, fromUnit, toUnit, category, dimensions])

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory)
    const firstUnit = Object.keys(unitCategories[newCategory].units)[0]
    const secondUnit = Object.keys(unitCategories[newCategory].units)[1]
    setFromUnit(firstUnit)
    setToUnit(secondUnit)
    setFromValue('')
    setToValue('')
    // Reset dimensions with proper structure
    setDimensions({
      length: { value: '', unit: 'meters' },
      width: { value: '', unit: 'meters' },
      height: { value: '', unit: 'meters' }
    })
  }

  const handleDimensionChange = (dimension, field, value) => {
    setDimensions(prev => ({
      ...prev,
      [dimension]: {
        ...prev[dimension],
        [field]: value
      }
    }))
  }

  const renderInputFields = () => {
    const fromUnitDetails = unitCategories[category].units[fromUnit]
    
    if (fromUnitDetails.multiInput) {
      const isVolume = fromUnitDetails.multiInput.type === 'cubic';
      const dimensionsList = isVolume ? 
        ['length', 'width', 'height'] : 
        ['length', 'width'];

      return (
        <div className="flex-1 space-y-4">
          {dimensionsList.map((dimension) => (
            <div key={dimension} className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {dimension}
                </label>
                <input
                  type="number"
                  value={dimensions[dimension]?.value || ''}
                  onChange={(e) => handleDimensionChange(dimension, 'value', e.target.value)}
                  placeholder={`Enter ${dimension}`}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit
                </label>
                <select
                  value={dimensions[dimension]?.unit || 'meters'}
                  onChange={(e) => handleDimensionChange(dimension, 'unit', e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(unitCategories.length.units).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Value
        </label>
        <input
          type="number"
          value={fromValue}
          onChange={(e) => setFromValue(e.target.value)}
          placeholder="Enter value"
          className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <img 
        src="/ruler.png" 
        alt="Ruler" 
        className="mx-auto my-4 max-w-[200px]"
      />
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
          Unit Converter
        </h1>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Object.entries(unitCategories).map(([key, { name }]) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
          </div>

          {/* From Unit */}
          <div className="mb-6">
            <div className="flex gap-4 mb-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(unitCategories[category].units).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            {renderInputFields()}
          </div>

          {/* To Unit */}
          <div className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(unitCategories[category].units).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Result
                </label>
                <input
                  type="text"
                  value={toValue}
                  readOnly
                  className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
