import { useQuery } from '@apollo/client';
import VAULTS_QUERY from './vaults.graphql';

const Vaults = () => {
  const { data, error } = useQuery(VAULTS_QUERY);

  console.log("VAULTS_QUERY error: ", error)
  console.log("VAULTS_QUERY data: ", data)

  return (
    <div >
      <h1>Vaults</h1>
      <ul>
        {data?.vaults?.map((vault: { name: string }) => (
          <li key={vault.name}>{vault.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Vaults;
