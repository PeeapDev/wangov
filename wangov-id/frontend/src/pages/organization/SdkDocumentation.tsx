import React, { useState } from 'react';
import { 
  DocumentTextIcon,
  CodeBracketIcon,
  ClipboardDocumentIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlayIcon,
  CubeIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

interface CodeExample {
  language: string;
  title: string;
  code: string;
  description: string;
}

interface SdkInfo {
  name: string;
  language: string;
  version: string;
  installCommand: string;
  githubUrl: string;
  docsUrl: string;
  icon: string;
  examples: CodeExample[];
}

const SdkDocumentation: React.FC = () => {
  const [selectedSdk, setSelectedSdk] = useState<string>('javascript');
  const [selectedExample, setSelectedExample] = useState<string>('verify-identity');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['getting-started']));
  const [copiedCode, setCopiedCode] = useState<string>('');

  const sdks: SdkInfo[] = [
    {
      name: 'WanGov-ID JavaScript SDK',
      language: 'javascript',
      version: '1.2.0',
      installCommand: 'npm install @wangov/identity-sdk',
      githubUrl: 'https://github.com/wangov/identity-sdk-js',
      docsUrl: 'https://docs.wangov.sl/sdk/javascript',
      icon: '🟨',
      examples: [
        {
          language: 'javascript',
          title: 'Initialize SDK',
          code: `import { WanGovIdentity } from '@wangov/identity-sdk';

const wanGov = new WanGovIdentity({
  apiKey: 'your-api-key',
  environment: 'sandbox', // or 'live'
  webhookSecret: 'your-webhook-secret'
});`,
          description: 'Initialize the WanGov Identity SDK with your API credentials'
        },
        {
          language: 'javascript',
          title: 'Verify Identity',
          code: `// Verify citizen identity
const verifyIdentity = async (nationalId) => {
  try {
    const result = await wanGov.identity.verify({
      nationalId: nationalId,
      requestId: 'unique-request-id',
      purpose: 'customer-onboarding'
    });
    
    if (result.verified) {
      console.log('Identity verified:', result.citizen);
      return result.citizen;
    } else {
      console.log('Verification failed:', result.reason);
      return null;
    }
  } catch (error) {
    console.error('Verification error:', error);
    throw error;
  }
};`,
          description: 'Verify a citizen\'s identity using their national ID'
        },
        {
          language: 'javascript',
          title: 'Handle Webhooks',
          code: `import express from 'express';
import { WanGovIdentity } from '@wangov/identity-sdk';

const app = express();
app.use(express.json());

app.post('/webhooks/wangov', (req, res) => {
  try {
    // Verify webhook signature
    const isValid = wanGov.webhooks.verify(
      req.body,
      req.headers['x-wangov-signature']
    );
    
    if (!isValid) {
      return res.status(401).send('Invalid signature');
    }
    
    const { event, data } = req.body;
    
    switch (event) {
      case 'identity.verified':
        console.log('Identity verified:', data);
        // Handle successful verification
        break;
      case 'identity.failed':
        console.log('Identity verification failed:', data);
        // Handle failed verification
        break;
      default:
        console.log('Unknown event:', event);
    }
    
    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Internal Server Error');
  }
});`,
          description: 'Handle webhook notifications from WanGov-ID'
        }
      ]
    },
    {
      name: 'WanGov-ID Python SDK',
      language: 'python',
      version: '1.1.0',
      installCommand: 'pip install wangov-identity',
      githubUrl: 'https://github.com/wangov/identity-sdk-python',
      docsUrl: 'https://docs.wangov.sl/sdk/python',
      icon: '🐍',
      examples: [
        {
          language: 'python',
          title: 'Initialize SDK',
          code: `from wangov_identity import WanGovIdentity

# Initialize the SDK
wangov = WanGovIdentity(
    api_key='your-api-key',
    environment='sandbox',  # or 'live'
    webhook_secret='your-webhook-secret'
)`,
          description: 'Initialize the WanGov Identity SDK with your API credentials'
        },
        {
          language: 'python',
          title: 'Verify Identity',
          code: `import asyncio

async def verify_identity(national_id):
    try:
        result = await wangov.identity.verify(
            national_id=national_id,
            request_id='unique-request-id',
            purpose='customer-onboarding'
        )
        
        if result.verified:
            print(f"Identity verified: {result.citizen}")
            return result.citizen
        else:
            print(f"Verification failed: {result.reason}")
            return None
            
    except Exception as error:
        print(f"Verification error: {error}")
        raise error

# Usage
citizen = asyncio.run(verify_identity('123456789'))`,
          description: 'Verify a citizen\'s identity using their national ID'
        },
        {
          language: 'python',
          title: 'Flask Webhook Handler',
          code: `from flask import Flask, request, jsonify
from wangov_identity import WanGovIdentity

app = Flask(__name__)
wangov = WanGovIdentity(api_key='your-api-key')

@app.route('/webhooks/wangov', methods=['POST'])
def handle_webhook():
    try:
        # Verify webhook signature
        signature = request.headers.get('X-WanGov-Signature')
        is_valid = wangov.webhooks.verify(request.json, signature)
        
        if not is_valid:
            return jsonify({'error': 'Invalid signature'}), 401
        
        event = request.json.get('event')
        data = request.json.get('data')
        
        if event == 'identity.verified':
            print(f"Identity verified: {data}")
            # Handle successful verification
        elif event == 'identity.failed':
            print(f"Identity verification failed: {data}")
            # Handle failed verification
        
        return jsonify({'status': 'success'}), 200
        
    except Exception as error:
        print(f"Webhook error: {error}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True)`,
          description: 'Handle webhook notifications using Flask'
        }
      ]
    },
    {
      name: 'WanGov-ID Java SDK',
      language: 'java',
      version: '1.0.0',
      installCommand: 'implementation "com.wangov:identity-sdk:1.0.0"',
      githubUrl: 'https://github.com/wangov/identity-sdk-java',
      docsUrl: 'https://docs.wangov.sl/sdk/java',
      icon: '☕',
      examples: [
        {
          language: 'java',
          title: 'Initialize SDK',
          code: `import com.wangov.identity.WanGovIdentity;
import com.wangov.identity.config.WanGovConfig;

public class IdentityService {
    private WanGovIdentity wanGov;
    
    public IdentityService() {
        WanGovConfig config = WanGovConfig.builder()
            .apiKey("your-api-key")
            .environment("sandbox") // or "live"
            .webhookSecret("your-webhook-secret")
            .build();
            
        this.wanGov = new WanGovIdentity(config);
    }
}`,
          description: 'Initialize the WanGov Identity SDK with your API credentials'
        },
        {
          language: 'java',
          title: 'Verify Identity',
          code: `import com.wangov.identity.models.VerificationRequest;
import com.wangov.identity.models.VerificationResult;

public class IdentityService {
    
    public VerificationResult verifyIdentity(String nationalId) {
        try {
            VerificationRequest request = VerificationRequest.builder()
                .nationalId(nationalId)
                .requestId("unique-request-id")
                .purpose("customer-onboarding")
                .build();
            
            VerificationResult result = wanGov.identity().verify(request);
            
            if (result.isVerified()) {
                System.out.println("Identity verified: " + result.getCitizen());
                return result;
            } else {
                System.out.println("Verification failed: " + result.getReason());
                return result;
            }
            
        } catch (Exception error) {
            System.err.println("Verification error: " + error.getMessage());
            throw new RuntimeException(error);
        }
    }
}`,
          description: 'Verify a citizen\'s identity using their national ID'
        },
        {
          language: 'java',
          title: 'Spring Boot Webhook',
          code: `import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.wangov.identity.WanGovIdentity;

@RestController
@RequestMapping("/webhooks")
public class WebhookController {
    
    private final WanGovIdentity wanGov;
    
    public WebhookController(WanGovIdentity wanGov) {
        this.wanGov = wanGov;
    }
    
    @PostMapping("/wangov")
    public ResponseEntity<String> handleWebhook(
            @RequestBody Map<String, Object> payload,
            @RequestHeader("X-WanGov-Signature") String signature) {
        
        try {
            // Verify webhook signature
            boolean isValid = wanGov.webhooks().verify(payload, signature);
            
            if (!isValid) {
                return ResponseEntity.status(401).body("Invalid signature");
            }
            
            String event = (String) payload.get("event");
            Map<String, Object> data = (Map<String, Object>) payload.get("data");
            
            switch (event) {
                case "identity.verified":
                    System.out.println("Identity verified: " + data);
                    // Handle successful verification
                    break;
                case "identity.failed":
                    System.out.println("Identity verification failed: " + data);
                    // Handle failed verification
                    break;
                default:
                    System.out.println("Unknown event: " + event);
            }
            
            return ResponseEntity.ok("OK");
            
        } catch (Exception error) {
            System.err.println("Webhook error: " + error.getMessage());
            return ResponseEntity.status(500).body("Internal Server Error");
        }
    }
}`,
          description: 'Handle webhook notifications using Spring Boot'
        }
      ]
    }
  ];

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const copyToClipboard = async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      toast.success('Code copied to clipboard!');
      setTimeout(() => setCopiedCode(''), 2000);
    } catch (error) {
      toast.error('Failed to copy code');
    }
  };

  const selectedSdkInfo = sdks.find(sdk => sdk.language === selectedSdk);
  const selectedExampleInfo = selectedSdkInfo?.examples.find(ex => ex.title.toLowerCase().replace(/\s+/g, '-') === selectedExample);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <DocumentTextIcon className="w-8 h-8 mr-3 text-green-600" />
          SDK Documentation & Integration Guide
        </h1>
        <p className="text-gray-600 mt-1">Complete guide to integrating WanGov-ID into your applications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow border p-4 sticky top-6">
            <h3 className="font-semibold text-gray-900 mb-4">Documentation</h3>
            
            {/* SDK Selection */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Choose SDK</h4>
              <div className="space-y-2">
                {sdks.map((sdk) => (
                  <button
                    key={sdk.language}
                    onClick={() => setSelectedSdk(sdk.language)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center ${
                      selectedSdk === sdk.language
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{sdk.icon}</span>
                    {sdk.language.charAt(0).toUpperCase() + sdk.language.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Sections */}
            <div className="space-y-2">
              {[
                { id: 'getting-started', title: 'Getting Started', icon: PlayIcon },
                { id: 'installation', title: 'Installation', icon: CommandLineIcon },
                { id: 'examples', title: 'Code Examples', icon: CodeBracketIcon },
                { id: 'api-reference', title: 'API Reference', icon: CubeIcon }
              ].map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center">
                      <section.icon className="w-4 h-4 mr-2" />
                      {section.title}
                    </div>
                    {expandedSections.has(section.id) ? (
                      <ChevronDownIcon className="w-4 h-4" />
                    ) : (
                      <ChevronRightIcon className="w-4 h-4" />
                    )}
                  </button>
                  
                  {expandedSections.has(section.id) && section.id === 'examples' && selectedSdkInfo && (
                    <div className="ml-6 mt-2 space-y-1">
                      {selectedSdkInfo.examples.map((example) => {
                        const exampleId = example.title.toLowerCase().replace(/\s+/g, '-');
                        return (
                          <button
                            key={exampleId}
                            onClick={() => setSelectedExample(exampleId)}
                            className={`w-full text-left px-2 py-1 text-xs rounded ${
                              selectedExample === exampleId
                                ? 'bg-green-50 text-green-700'
                                : 'text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {example.title}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow border">
            {/* Getting Started Section */}
            {expandedSections.has('getting-started') && (
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600 mb-4">
                    WanGov-ID provides official SDKs for multiple programming languages to help you integrate 
                    identity verification into your applications quickly and securely.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-900 mb-2">Before You Start</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Ensure your business is approved for live API access</li>
                      <li>• Have your API key and webhook secret ready</li>
                      <li>• Review the API rate limits and usage guidelines</li>
                    </ul>
                  </div>

                  <h4 className="font-medium text-gray-900 mb-2">Key Features</h4>
                  <ul className="text-gray-600 space-y-1 mb-4">
                    <li>• Real-time identity verification</li>
                    <li>• Webhook notifications for async processing</li>
                    <li>• Sandbox environment for testing</li>
                    <li>• Comprehensive error handling</li>
                    <li>• Built-in security features</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Installation Section */}
            {expandedSections.has('installation') && selectedSdkInfo && (
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Installation</h2>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">{selectedSdkInfo.name}</h4>
                  <p className="text-gray-600 text-sm mb-3">Version {selectedSdkInfo.version}</p>
                  
                  <div className="bg-gray-900 rounded-lg p-4 relative">
                    <code className="text-green-400 text-sm">{selectedSdkInfo.installCommand}</code>
                    <button
                      onClick={() => copyToClipboard(selectedSdkInfo.installCommand, 'install')}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white"
                    >
                      {copiedCode === 'install' ? (
                        <CheckIcon className="w-4 h-4" />
                      ) : (
                        <ClipboardDocumentIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <a
                    href={selectedSdkInfo.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </a>
                  <a
                    href={selectedSdkInfo.docsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
                  >
                    <DocumentTextIcon className="w-4 h-4 mr-2" />
                    Full Documentation
                  </a>
                </div>
              </div>
            )}

            {/* Code Examples Section */}
            {expandedSections.has('examples') && selectedExampleInfo && (
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Code Examples</h2>
                
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">{selectedExampleInfo.title}</h4>
                  <p className="text-gray-600 text-sm mb-4">{selectedExampleInfo.description}</p>
                  
                  <div className="bg-gray-900 rounded-lg relative">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
                      <span className="text-gray-300 text-sm">{selectedExampleInfo.language}</span>
                      <button
                        onClick={() => copyToClipboard(selectedExampleInfo.code, selectedExample)}
                        className="p-1 text-gray-400 hover:text-white"
                      >
                        {copiedCode === selectedExample ? (
                          <CheckIcon className="w-4 h-4" />
                        ) : (
                          <ClipboardDocumentIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <pre className="p-4 overflow-x-auto">
                      <code className="text-sm text-gray-300">{selectedExampleInfo.code}</code>
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* API Reference Section */}
            {expandedSections.has('api-reference') && (
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">API Reference</h2>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Base URLs</h4>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                      <div>
                        <strong className="text-sm text-gray-700">Sandbox:</strong>
                        <code className="ml-2 text-sm bg-white px-2 py-1 rounded">https://api-sandbox.wangov.sl/v1</code>
                      </div>
                      <div>
                        <strong className="text-sm text-gray-700">Live:</strong>
                        <code className="ml-2 text-sm bg-white px-2 py-1 rounded">https://api.wangov.sl/v1</code>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Authentication</h4>
                    <p className="text-gray-600 text-sm mb-2">
                      All API requests require authentication using your API key in the Authorization header:
                    </p>
                    <div className="bg-gray-900 rounded-lg p-4">
                      <code className="text-green-400 text-sm">Authorization: Bearer your-api-key</code>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Rate Limits</h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <ul className="text-sm text-yellow-800 space-y-1">
                        <li>• Sandbox: 100 requests per minute</li>
                        <li>• Live: 1000 requests per minute</li>
                        <li>• Burst limit: 50 requests per 10 seconds</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Error Codes</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-4 py-2 text-sm text-gray-900">400</td>
                            <td className="px-4 py-2 text-sm text-gray-600">Bad Request - Invalid parameters</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-sm text-gray-900">401</td>
                            <td className="px-4 py-2 text-sm text-gray-600">Unauthorized - Invalid API key</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-sm text-gray-900">403</td>
                            <td className="px-4 py-2 text-sm text-gray-600">Forbidden - Insufficient permissions</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-sm text-gray-900">429</td>
                            <td className="px-4 py-2 text-sm text-gray-600">Too Many Requests - Rate limit exceeded</td>
                          </tr>
                          <tr>
                            <td className="px-4 py-2 text-sm text-gray-900">500</td>
                            <td className="px-4 py-2 text-sm text-gray-600">Internal Server Error</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SdkDocumentation;
