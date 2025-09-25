import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import { main, verify_compressed } from './pkg-node/sp1_wasm_verifier.js';

async function testVerification() {
  console.log('🧪 Testing SP1 WASM STARK Verifier\n');

  try {
    main();
    console.log('✅ WASM module initialized\n');

    // Load eth block proof and verification key
    const proofPath = path.join(__dirname, 'proofs', 'sp1-marlin-proof.bin');
    const vkPath = path.join(__dirname, 'vks', 'marlin-vk.bin');

    console.log('\nLoading eth proof and verification key...');
    const proofBytes = fs.readFileSync(proofPath);
    const vkBytes = fs.readFileSync(vkPath);

    console.log(`  Proof size: ${proofBytes.length} bytes`);
    console.log(`  VK size: ${vkBytes.length} bytes`);

    // Test verification
    console.log('\n🔍 Verifying SP1 compressed block proof...');
    const start = performance.now();
    const result = verify_compressed(proofBytes, vkBytes);
    const end = performance.now();
    console.log(`✅ Verification result: ${result}`);

    console.log('\n📊 Verification Summary:');
    console.log(`  STARK proof: ${result ? '✅ VALID' : '❌ INVALID'}`);
    console.log(`  Time taken: ${end - start} milliseconds`);
  } catch (error) {
    console.error('❌ Error during verification:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

testVerification();
