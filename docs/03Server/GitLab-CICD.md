adduser --uid 80 --gid 80 --gid wheel -c "Web Application" www
adduser --uid 80 --gid 80 -c "Web Application" www


lrsync 'zito-admin/target/site/*' www@report.netkiller.cn:/opt/netkiller.cn/report.netkiller.cn


- rsync -auzv --delete * www@13.229.82.92:/opt/netkiller.cn/www.netkiller.cn
- ssh www@13.229.82.92 "pm2 --update-env restart /opt/netkiller.cn/www.netkiller.cn/app.js


https://dev.to/themodernpk/solved-gitlab-runner-error-job-failed-prepare-environment-process-exited-with-status-1-check-38pj

