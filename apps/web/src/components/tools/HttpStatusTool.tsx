'use client';

import { useState, useMemo } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

const STATUS_CODES = [
  { code: 100, name: 'Continue', desc: 'The server has received the request headers and the client should proceed to send the request body.' },
  { code: 101, name: 'Switching Protocols', desc: 'The requester has asked the server to switch protocols.' },
  { code: 200, name: 'OK', desc: 'Standard response for successful HTTP requests.' },
  { code: 201, name: 'Created', desc: 'The request has been fulfilled, resulting in the creation of a new resource.' },
  { code: 202, name: 'Accepted', desc: 'The request has been accepted for processing, but the processing has not been completed.' },
  { code: 204, name: 'No Content', desc: 'The server successfully processed the request and is not returning any content.' },
  { code: 206, name: 'Partial Content', desc: 'The server is delivering only part of the resource due to a range header sent by the client.' },
  { code: 301, name: 'Moved Permanently', desc: 'This and all future requests should be directed to the given URI.' },
  { code: 302, name: 'Found', desc: 'The resource was found, but at a different URI temporarily.' },
  { code: 304, name: 'Not Modified', desc: 'Indicates that the resource has not been modified since the version specified by the request headers.' },
  { code: 307, name: 'Temporary Redirect', desc: 'The request should be repeated with another URI; however, future requests should still use the original URI.' },
  { code: 308, name: 'Permanent Redirect', desc: 'The request and all future requests should be repeated using another URI.' },
  { code: 400, name: 'Bad Request', desc: 'The server cannot or will not process the request due to an apparent client error.' },
  { code: 401, name: 'Unauthorized', desc: 'Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided.' },
  { code: 403, name: 'Forbidden', desc: 'The request was valid, but the server is refusing action. The user might not have the necessary permissions.' },
  { code: 404, name: 'Not Found', desc: 'The requested resource could not be found but may be available in the future.' },
  { code: 405, name: 'Method Not Allowed', desc: 'A request method is not supported for the requested resource.' },
  { code: 408, name: 'Request Timeout', desc: 'The server timed out waiting for the request.' },
  { code: 409, name: 'Conflict', desc: 'Indicates that the request could not be processed because of conflict in the current state of the resource.' },
  { code: 410, name: 'Gone', desc: 'Indicates that the requested resource is no longer available and will not be available again.' },
  { code: 413, name: 'Payload Too Large', desc: 'The request is larger than the server is willing or able to process.' },
  { code: 415, name: 'Unsupported Media Type', desc: 'The request entity has a media type which the server or resource does not support.' },
  { code: 422, name: 'Unprocessable Entity', desc: 'The request was well-formed but was unable to be followed due to semantic errors.' },
  { code: 429, name: 'Too Many Requests', desc: 'The user has sent too many requests in a given amount of time.' },
  { code: 500, name: 'Internal Server Error', desc: 'A generic error message, given when an unexpected condition was encountered and no more specific message is suitable.' },
  { code: 501, name: 'Not Implemented', desc: 'The server either does not recognize the request method, or it lacks the ability to fulfil the request.' },
  { code: 502, name: 'Bad Gateway', desc: 'The server was acting as a gateway or proxy and received an invalid response from the upstream server.' },
  { code: 503, name: 'Service Unavailable', desc: 'The server is currently unavailable (because it is overloaded or down for maintenance).' },
  { code: 504, name: 'Gateway Timeout', desc: 'The server was acting as a gateway or proxy and did not receive a timely response from the upstream server.' },
];

function getStatusStyle(code: number) {
  if (code < 200) return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  if (code < 300) return 'text-success bg-success/10 border-success/20';
  if (code < 400) return 'text-warning bg-warning/10 border-warning/20';
  if (code < 500) return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
  return 'text-danger bg-danger/10 border-danger/20';
}

export default function HttpStatusTool() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return STATUS_CODES.filter(s => 
        String(s.code).includes(q) || 
        s.name.toLowerCase().includes(q) || 
        s.desc.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="max-w-2xl mx-auto">
        <Input 
            placeholder="Search by code (e.g. 404) or keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            className="text-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(s => (
            <Card key={s.code} className="group hover:border-accent/30 transition-all p-0 overflow-hidden">
                <div className="flex items-stretch min-h-[100px]">
                    <div className={`w-24 flex flex-col items-center justify-center border-r border-white/5 ${getStatusStyle(s.code)}`}>
                        <span className="text-2xl font-black">{s.code}</span>
                        <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60">Status</span>
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-center">
                        <h3 className="text-white font-bold mb-1 group-hover:text-accent transition-colors">{s.name}</h3>
                        <p className="text-xs text-white/40 leading-relaxed">{s.desc}</p>
                    </div>
                </div>
            </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center opacity-20">
            <div className="text-4xl mb-4">🛰️</div>
            <p className="text-sm font-medium">No status codes found matching your query.</p>
        </div>
      )}
    </div>
  );
}
