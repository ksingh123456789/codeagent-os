import re

with open('PlatformContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'fetch\(`\$\{baseUrl\}/tenant/projects`, \{ headers \}\)', '', content)
content = re.sub(r',\s*fetch\(`\$\{baseUrl\}/tenant/projects`, \{ headers \}\)', '', content)
content = re.sub(r'const projData = await projRes.json\(\);', '', content)
content = content.replace('dashRes.ok && devRes.ok && projRes.ok', 'dashRes.ok && devRes.ok')
content = content.replace('const [dashRes, devRes, projRes]', 'const [dashRes, devRes]')

content = re.sub(r'projects: ProjectMapping\[\];\s*currentTenantProjects: ProjectMapping\[\];\s*', '', content)
content = re.sub(r'addProject: \(proj: \{.*?\}\) => Promise<any>;\s*', '', content)
content = re.sub(r'const INITIAL_PROJECTS: ProjectMapping\[\] = \[.*?\];\n\n', '', content, flags=re.DOTALL)
content = re.sub(r'const \[projects, setProjects\].*?INITIAL_PROJECTS;\n  \}\);\n', '', content, flags=re.DOTALL)
content = re.sub(r'const currentTenantProjects = projects\.filter.*?;\n', '', content)
content = re.sub(r'const addProject = async.*?};\n', '', content, flags=re.DOTALL)
content = re.sub(r'projects,\n\s*currentTenantProjects,\n\s*', '', content)
content = re.sub(r'addProject,\n\s*', '', content)

content = content.replace("level: 'ERROR'", "level: 'AGENT'")
content = content.replace("newCompanyObj = {", "newCompanyObj: Company = {")

with open('PlatformContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
