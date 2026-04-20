export const resumeData = {
  experience: [
    {
      company: 'Municipal Property Assessment Corporation (MPAC)',
      role: 'Technical Infrastructure Cloud Analyst',
      period: '2025 - Present',
      location: 'Pickering, ON',
      highlights: [
        'Deploying and managing containerized applications on Kubernetes (AKS/EKS) across development, staging, and production environments',
        'Building and maintaining CI/CD pipelines using GitLab CI and GitHub Actions for automated testing, building, and deployment of microservices',
        'Implementing GitOps workflows with ArgoCD for declarative, version-controlled continuous delivery to Kubernetes clusters',
        'Provisioning and managing cloud infrastructure on Azure and AWS using Terraform and ARM templates',
        'Monitoring cluster health and application performance using Prometheus, Grafana, and Azure Monitor to ensure SLA compliance',
      ],
    },
    {
      company: 'Pace Technical',
      role: 'Cloud/Systems Administrator',
      period: '2023 - 2025',
      location: 'Markham, ON',
      highlights: [
        'Managed containerized workloads on Docker and Kubernetes across multiple environments',
        'Automated infrastructure provisioning with Terraform and Ansible',
        'Implemented GitOps workflows with ArgoCD for continuous deployment',
        'Configured network infrastructure including VPNs, firewalls, and load balancers',
        'Reduced infrastructure costs by 40% through resource optimization and auto-scaling',
      ],
    },
    {
      company: 'Jumia',
      role: 'Systems Administrator',
      period: '2014 - 2022',
      location: 'Markham, ON',
      highlights: [
        'Administered Linux and Windows server environments',
        'Managed Cisco network infrastructure including routers, switches, and firewalls',
        'Implemented monitoring solutions with Nagios and Zabbix',
        'Automated routine tasks using Bash and Python scripting',
        'Provided L2/L3 support for production systems',
      ],
    },
  ],
  certifications: [
    { name: 'Certified Kubernetes Administrator (CKA)', issuer: 'CNCF', year: '2025', icon: 'kubernetes' },
    { name: 'Microsoft Certified: Azure Solutions Architect Expert', issuer: 'Microsoft', year: '2023', icon: 'azure' },
    { name: 'Microsoft Certified: Azure Administrator Associate', issuer: 'Microsoft', year: '2023', icon: 'azure' },
    { name: 'HashiCorp Certified: Terraform Associate', issuer: 'HashiCorp', year: '2022', icon: 'terraform' },
    { name: 'Cisco Certified Network Associate (CCNA)', issuer: 'Cisco', year: '2021', icon: 'cisco' },
    { name: 'Kubernetes and Cloud Native Associate (KCNA)', issuer: 'CNCF', year: '2025', icon: 'kubernetes' },
  ],
  skills: {
    'Containers & Orchestration': ['Kubernetes', 'Docker', 'Helm', 'ArgoCD'],
    'Cloud Platforms': ['Azure', 'AWS', 'GCP'],
    'Infrastructure as Code': ['Terraform', 'Ansible', 'Pulumi', 'ARM Templates', 'Bicep'],
    'CI/CD': ['GitHub Actions', 'Azure DevOps', 'Jenkins', 'GitLab CI'],
    'Monitoring & Observability': ['Prometheus', 'Grafana', 'Loki', 'Jaeger', 'Azure Monitor'],
    'Networking': ['Cisco IOS', 'VPN', 'DNS', 'Load Balancers', 'Firewalls', 'TCP/IP'],
    'Scripting & Languages': ['Bash', 'Python', 'PowerShell', 'YAML', 'HCL'],
    'Security': ['Trivy', 'OPA', 'Falco', 'Vault', 'Azure Key Vault'],
  },
  education: [
    {
      institution: 'Centennial College',
      degree: 'Computer Systems Technology (Honors)',
    },
    {
      institution: 'University of Ibadan',
      degree: 'Master of Science in Computer Science',
    },
    {
      institution: 'Bowen University',
      degree: 'Bachelor of Science in Computer Science',
    },
  ],
}
