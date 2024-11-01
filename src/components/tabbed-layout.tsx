"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SRSDocument from './srs-document'
import GraphVisualization from './graph-visualization'
import ProjectManagementChat from '../components/user-story'

export default function TabbedLayout() {
  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="srs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="srs">SRS Document</TabsTrigger>
          <TabsTrigger value="Userstory">Userstory</TabsTrigger>
          <TabsTrigger value="graph">Graph</TabsTrigger>
        </TabsList>
        <TabsContent value="srs">
          <Card>
            <CardHeader>
              <CardTitle>Software Requirements Specification</CardTitle>
              <CardDescription>Upload and process SRS documents</CardDescription>
            </CardHeader>
            <CardContent>
              <SRSDocument />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="Userstory">
          <Card>
            <CardHeader>
              <CardTitle>Userstory</CardTitle>
              <CardDescription>Explore the understory content</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectManagementChat/>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="graph">
          <Card>
            <CardHeader>
              <CardTitle>Graph</CardTitle>
              <CardDescription>Visualize data with graphs</CardDescription>
            </CardHeader>
           
            <CardContent>
            
            <GraphVisualization />
           
            
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}