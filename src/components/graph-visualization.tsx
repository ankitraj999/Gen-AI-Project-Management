"use client"

import { useState, useEffect,useRef } from 'react'
import dynamic from 'next/dynamic'

const ForceGraph2D = dynamic(() => import('react-force-graph').then(mod => mod.ForceGraph2D), { ssr: false })

interface GraphData {
  nodes: { id: string; label: string }[]
  links: { source: string; target: string; label: string }[]
}

export default function GraphVisualization() {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [enableZoom, setEnableZoom] = useState(false)
  const graphRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const response = await fetch('/api/graph-data')
        if (!response.ok) {
          throw new Error('Failed to fetch graph data')
        }
        const data : GraphData = await response.json()

        // Debugging: Log the fetched data
        console.log('Fetched graph data:', data)

        // Validate nodes and links
        const validNodes = new Set(data.nodes.map(node => node.id))
        const validLinks = data.links.filter(link => validNodes.has(link.source) && validNodes.has(link.target))

        const validNodesArray = Array.from(validNodes)
  .map(nodeId => data.nodes.find(node => node.id === nodeId))
  .filter((node): node is { id: string; label: string } => node !== undefined);
        setGraphData({ nodes: validNodesArray, links: validLinks })

      } catch (err) {
        setError('Error fetching graph data. Please try again later.')
        console.error('Error fetching graph data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGraphData()
  }, [])

  useEffect(() => {
    const handleMouseEnter = () => setEnableZoom(true)
    const handleMouseLeave = () => setEnableZoom(false)

    const graphElement = graphRef.current
    if (graphElement) {
      graphElement.addEventListener('mouseenter', handleMouseEnter)
      graphElement.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      if (graphElement) {
        graphElement.removeEventListener('mouseenter', handleMouseEnter)
        graphElement.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])


  if (loading) {
    return <div>Loading graph data...</div>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (

    <div ref={graphRef} className="flex justify-center items-center h-full w-full">
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="label"
        linkLabel="label"
        nodeAutoColorBy="label"
        linkDirectionalArrowLength={3.5}
        linkDirectionalArrowRelPos={1}
        enableZoomInteraction={enableZoom}
        
        
      />
    </div>
  )
}
