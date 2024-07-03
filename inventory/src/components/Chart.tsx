import { PureComponent } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface ChartProps<T> {
  data: T[];
  xKey: keyof T;
  yKey: keyof T;
}

export default class Chart<T extends object> extends PureComponent<
  ChartProps<T>
> {
  render() {
    const { data, xKey, yKey } = this.props;

    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          {/* Use the passed props directly */}
          <XAxis dataKey={xKey as string} />
          <YAxis />
          <Tooltip />
          <Bar dataKey={yKey as string} fill="#2a958a" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
}
