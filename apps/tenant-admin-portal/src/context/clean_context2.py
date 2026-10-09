import re

with open('PlatformContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the fetchedProjects block
content = re.sub(r'const fetchedProjects: ProjectMapping\[\] = projData.*?\}\);', '', content, flags=re.DOTALL)

# Remove setProjects blocks everywhere
content = re.sub(r'setProjects\(.*?\);\n', '', content, flags=re.DOTALL)
content = re.sub(r'setProjects\(prev => \{.*?\}\);\n', '', content, flags=re.DOTALL)

# Remove projects tracking in useEffect
content = re.sub(r"localStorage\.setItem\('cag_projects', JSON\.stringify\(projects\)\);\n\s*\}, \[projects\]\);", '', content, flags=re.DOTALL)
content = re.sub(r"useEffect\(\(\) => \{\n\s*localStorage\.setItem\('cag_projects', JSON\.stringify\(projects\)\);\n\s*\}, \[projects\]\);", '', content, flags=re.DOTALL)

# Remove addProject function completely (if still there)
content = re.sub(r'const addProject = async.*?};\n', '', content, flags=re.DOTALL)

with open('PlatformContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
