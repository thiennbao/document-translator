import * as React from "react";

interface AppProps {
  title: string;
}

const App: React.FC<AppProps> = (props: AppProps) => {
  return (
    <div>
      <div className="bg-emerald-500">{props.title}</div>
    </div>
  );
};

export default App;
