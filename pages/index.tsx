import { useSetState } from "react-use";
import { useMemo } from "react";
import _ from "lodash";

type Parametros = {
  L: number;
  temperatura_0: number;
  temperatura_barra_inicial: number;
  temperatura_l: number;
  n_intervalos: number;
  alfa: number;
  delta_t: number;
  n_iteraciones_tiempo: number;
};

const calcula = (parametros: Parametros) => {
  const {
    temperatura_0,
    temperatura_barra_inicial,
    temperatura_l,
    n_iteraciones_tiempo,
    n_intervalos,
    alfa,
    L,
    delta_t,
  } = parametros;

  const k = alfa * (delta_t / Math.pow(L / n_intervalos, 2));

  // if (typeof window !== "undefined") {
  //   alert(`k=${k}`);
  // }
  // const k = 0.5;

  const resultados: Record<number, number[]> = {};

  let barraActual = new Array(n_intervalos).fill(0).map((_v, index) => {
    if (index === 0) {
      return temperatura_0;
    } else if (index === n_intervalos - 1) {
      return temperatura_l;
    } else {
      return temperatura_barra_inicial;
    }
  });

  resultados[0] = [...barraActual];

  for (let i = 0; i < n_iteraciones_tiempo; i++) {
    barraActual = barraActual.map((tij, index) => {
      let tij_plus1: number;
      if (index === 0 || index === n_intervalos - 1) {
        tij_plus1 = tij;
      } else {
        tij_plus1 =
          tij +
          k * (barraActual[index + 1] + -2 * tij + barraActual[index - 1]);
      }

      return tij_plus1;
    });
    resultados[i + 1] = [...barraActual];
  }

  return resultados;
};

const IndexPage = () => {
  const [parametros, setParametros] = useSetState<Parametros>({
    L: 24,
    temperatura_0: 87,
    temperatura_barra_inicial: -3,
    temperatura_l: 43,
    n_intervalos: 8,
    alfa: 500,
    delta_t: 0.001,
    n_iteraciones_tiempo: 20,
  });

  const resultados = useMemo(() => {
    return calcula(parametros);
  }, [parametros]);

  return (
    <div style={{ whiteSpace: "pre-wrap" }}>
      {_.map(parametros, (value, key) => {
        return (
          <>
            <p>{key}=</p>
            <input
              value={value}
              type="number"
              onChange={({ target: { value } }) => {
                setParametros({
                  [key]: _.toNumber(value),
                });
              }}
            />
          </>
        );
      })}
      <br />
      <h1>Resultados</h1>
      {_.map(resultados, (value, key) => {
        return (
          <div>
            <p>Tiempo={key}</p>
            <p>{value.map((v) => v.toFixed(3)).join(" | ")}</p>
          </div>
        );
      })}
    </div>
  );
};

export default IndexPage;
