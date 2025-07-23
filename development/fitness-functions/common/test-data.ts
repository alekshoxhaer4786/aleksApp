const generateCreateFileDiff = (filePath = 'file.txt', content = 'Lorem ipsum'): string => `diff --git a/${filePath} b/${filePath}
new file mode 100644
index 0000000..30d74d258
--- /dev/null
+++ b/${filePath}
@@ -0,0 +1 @@
+${content}`;

const generateModifyFilesDiff = (filePath = 'file.txt', addition = 'Lorem ipsum', removal = ''): string => {
  const changes = [];
  if (addition) changes.push(`@@ -1,3 +1,8 @@\n+${addition}`);
  if (removal) changes.push(`@@ -34,33 +39,4 @@\n-${removal}`);
  return `diff --git a/${filePath} b/${filePath}
index 57d5de75c..808d8ba37 100644
--- a/${filePath}
+++ b/${filePath}
${changes.join('\n')}`;
};

export { generateCreateFileDiff, generateModifyFilesDiff };
