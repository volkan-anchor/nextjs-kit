import { useQuery } from '@apollo/client';
import VAULTS_QUERY from './vaults.graphql';

const Vaults = () => {
  const { data } = useQuery(VAULTS_QUERY);

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
