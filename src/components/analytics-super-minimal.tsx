export function AnalyticsSuperMinimal() {
  return (
    <div style={{ padding: '40px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px', color: '#000' }}>
        ✅ Analytics fonctionne
      </h1>
      <p style={{ fontSize: '18px', color: '#333' }}>
        Si vous voyez ce message, la page Analytics charge correctement.
      </p>
      <div style={{ 
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#4CAF50', 
        color: 'white',
        borderRadius: '8px'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>✓ TEST RÉUSSI</h2>
        <p>React fonctionne, le routing fonctionne, le composant charge.</p>
      </div>
    </div>
  );
}
