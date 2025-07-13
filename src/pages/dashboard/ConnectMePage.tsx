
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Github, Instagram, Linkedin, Youtube, Mail } from 'lucide-react';

const socialLinks = [
  { href: 'https://www.linkedin.com/in/vinaytz', icon: Linkedin, label: 'LinkedIn', color: '#0A66C2' },
  { href: 'https://github.com/vinaytz', icon: Github, label: 'GitHub', color: '#FFFFFF' },
  { href: 'https://www.instagram.com/vinaytz', icon: Instagram, label: 'Instagram', color: '#E4405F' },
  { href: 'https://www.youtube.com/@noctivagousgg', icon: Youtube, label: 'YouTube', color: '#FF0000' },
];

export default function ConnectMePage() {
  return (
    <Card className="bg-gray-800 border-gray-700 shadow-lg rounded-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-100">
          <Mail className="h-5 w-5" /> Connect with Me
        </CardTitle>
        <CardDescription className="text-gray-400">
          Follow my work and get in touch on these platforms.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-all duration-200 border border-gray-700"
            >
              <link.icon className="h-7 w-7" style={{ color: link.color }} />
              <span className="text-lg font-medium text-gray-100">{link.label}</span>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
