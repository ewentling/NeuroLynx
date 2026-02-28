
import { ChartData } from '../types';

export class VisualizationService {

    // Transform raw data into Recharts friendly format
    formatDataForBarChart(data: any[], xAxisKey: string, yAxisKey: string) {
        return data.map(item => ({
            name: item[xAxisKey],
            value: item[yAxisKey]
        }));
    }

    // Basic Excel parsing simulation (real implementation would use 'xlsx' library)
    async parseExcelData(file: File): Promise<any[]> {
        console.log(`Parsing excel file: ${file.name}`);
        // In a real app: const notebook = XLSX.read(await file.arrayBuffer());

        return new Promise((resolve) => {
            setTimeout(() => {
                // Return dummy data for simulation
                const mockData = [
                    { month: 'Jan', revenue: 4000, expenses: 2400 },
                    { month: 'Feb', revenue: 3000, expenses: 1398 },
                    { month: 'Mar', revenue: 2000, expenses: 9800 },
                    { month: 'Apr', revenue: 2780, expenses: 3908 },
                    { month: 'May', revenue: 1890, expenses: 4800 },
                    { month: 'Jun', revenue: 2390, expenses: 3800 },
                ];
                resolve(mockData);
            }, 1500);
        });
    }

    generateChartConfig(type: 'bar' | 'pie' | 'line') {
        switch (type) {
            case 'bar':
                return { color: '#06b6d4' };
            case 'pie':
                return { colors: ['#06b6d4', '#f97316', '#8b5cf6', '#ec4899'] };
            case 'line':
                return { color: '#f97316' };
            default:
                return { color: '#94a3b8' };
        }
    }
}
