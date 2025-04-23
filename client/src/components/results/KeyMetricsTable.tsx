import React from 'react';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from '@/components/ui/progress';

interface KeyMetricsTableProps {
  categoryScores: Record<string, number>;
}

const KeyMetricsTable: React.FC<KeyMetricsTableProps> = ({ categoryScores }) => {
  // Define key metrics for each dimension
  // In a real application, this would come from an API or database
  const dimensionMetrics: Record<string, { name: string; value: number; unit: string }[]> = {
    "Strategic Governance & Value Management": [
      { name: "Executive Engagement Index", value: 72, unit: "%" },
      { name: "Business Case ROI Realization", value: 65, unit: "%" },
      { name: "Decision Latency", value: 8, unit: "days" },
      { name: "Real-time KPI Compliance", value: 83, unit: "%" }
    ],
    "Program & Project Execution": [
      { name: "Risk Closure Rate", value: 68, unit: "%" },
      { name: "Project Delivery Predictability", value: 59, unit: "%" },
      { name: "PMO Maturity Score", value: 62, unit: "/100" },
      { name: "Vendor SLA Adherence", value: 81, unit: "%" }
    ],
    "Technical Architecture & Infrastructure": [
      { name: "System Uptime", value: 99.8, unit: "%" },
      { name: "Incident Response Time", value: 4.2, unit: "hours" },
      { name: "API Integration Coverage", value: 45, unit: "%" },
      { name: "Cloud Cost Optimization", value: -12, unit: "% variance" }
    ],
    "Security, Compliance & Data Management": [
      { name: "Compliance Findings", value: 8, unit: "open issues" },
      { name: "Data Quality Index", value: 76, unit: "%" },
      { name: "Release Success Rate", value: 92, unit: "%" },
      { name: "Audit Trail Completeness", value: 100, unit: "%" }
    ],
    "Business Process & Solution Design": [
      { name: "Process Automation Rate", value: 41, unit: "%" },
      { name: "Customization Ratio", value: 28, unit: "%" },
      { name: "Standardization Score", value: 69, unit: "%" },
      { name: "AI Usage Index", value: 15, unit: "processes" }
    ],
    "Core Module Configuration": [
      { name: "Test Coverage Ratio", value: 72, unit: "%" },
      { name: "Validation Defect Rate", value: 3.8, unit: "per release" },
      { name: "Finance Module Maturity", value: 68, unit: "/100" },
      { name: "SCM Module Maturity", value: 55, unit: "/100" }
    ],
    "Change Management & User Adoption": [
      { name: "User Adoption Rate", value: 63, unit: "%" },
      { name: "Training Completion", value: 87, unit: "%" },
      { name: "Change Resistance Index", value: 12, unit: "incidents" },
      { name: "Stakeholder Engagement Score", value: 71, unit: "/100" }
    ],
    "Support & Continuous Improvement": [
      { name: "Support Resolution Time", value: 8.5, unit: "hours" },
      { name: "Continuous Improvement Initiatives", value: 7, unit: "per quarter" },
      { name: "Hypercare Effectiveness", value: 11, unit: "days to stabilize" },
      { name: "ITIL Alignment Score", value: 64, unit: "/100" }
    ]
  };

  // Function to determine metric status color
  const getMetricStatusColor = (metricName: string, value: number): string => {
    // Define thresholds based on metric type
    // This is simplified - in a real app, you'd have more sophisticated logic
    if (metricName.includes("Uptime") || metricName.includes("Rate") || metricName.includes("Index") || 
        metricName.includes("Coverage") || metricName.includes("Completion") || metricName.includes("Score")) {
      if (value < 50) return "text-red-600";
      if (value < 70) return "text-amber-600";
      if (value < 85) return "text-blue-600";
      return "text-green-600";
    }
    
    if (metricName.includes("Latency") || metricName.includes("Time") || metricName.includes("Defect") || 
        metricName.includes("Resistance") || metricName.includes("issues")) {
      if (value > 20) return "text-red-600";
      if (value > 10) return "text-amber-600";
      if (value > 5) return "text-blue-600";
      return "text-green-600";
    }
    
    // Default case
    return "text-muted-foreground";
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      {Object.entries(categoryScores)
        .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
        .map(([dimension, score]) => (
          <AccordionItem key={dimension} value={dimension}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex flex-1 items-center">
                <span className="flex-1 text-left">{dimension}</span>
                <div className="flex items-center gap-3 mr-4">
                  <Progress 
                    value={score} 
                    className="w-[100px] h-2" 
                    indicatorColor={
                      score < 40 ? "bg-red-500" : 
                      score < 60 ? "bg-amber-500" : 
                      score < 80 ? "bg-blue-500" : 
                      "bg-green-500"
                    }
                  />
                  <span className="text-sm font-medium">{score}/100</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 py-2">
                <h4 className="text-sm font-semibold">Key Metrics</h4>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">Metric</th>
                        <th className="px-3 py-2 text-center font-medium">Value</th>
                        <th className="px-3 py-2 text-left font-medium">Status</th>
                        <th className="px-3 py-2 text-left font-medium">Recommendation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {(dimensionMetrics[dimension] || []).map((metric, index) => {
                        const statusColor = getMetricStatusColor(metric.name, metric.value);
                        
                        return (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                            <td className="px-3 py-2 font-medium">{metric.name}</td>
                            <td className={`px-3 py-2 text-center ${statusColor}`}>
                              {metric.value}{metric.unit}
                            </td>
                            <td className="px-3 py-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                statusColor === "text-red-600" ? "bg-red-100 text-red-800" : 
                                statusColor === "text-amber-600" ? "bg-amber-100 text-amber-800" : 
                                statusColor === "text-blue-600" ? "bg-blue-100 text-blue-800" : 
                                "bg-green-100 text-green-800"
                              }`}>
                                {statusColor === "text-red-600" ? "Needs Attention" : 
                                 statusColor === "text-amber-600" ? "Needs Improvement" : 
                                 statusColor === "text-blue-600" ? "Satisfactory" : 
                                 "Good"}
                              </span>
                            </td>
                            <td className="px-3 py-2 text-sm text-muted-foreground">
                              {statusColor === "text-red-600" ? `Improve ${metric.name.toLowerCase()} through targeted initiatives` : 
                               statusColor === "text-amber-600" ? `Monitor and gradually enhance ${metric.name.toLowerCase()}` : 
                               statusColor === "text-blue-600" ? `Maintain current level of ${metric.name.toLowerCase()}` : 
                               `Continue excellent performance in ${metric.name.toLowerCase()}`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
    </Accordion>
  );
};

export default KeyMetricsTable;